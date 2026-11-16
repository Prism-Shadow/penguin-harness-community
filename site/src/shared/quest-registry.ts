interface RegistryTask {
  fields: Record<string, string | undefined>;
  references: string[];
}

function decodeValue(raw: string): string | undefined {
  const value = raw.trim();
  if (value === "null") return undefined;
  // The sync script escapes quotes and backslashes, but leaves literal newlines.
  return value.startsWith('"')
    ? JSON.parse(value.replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/\t/g, "\\t"))
    : value;
}

/** Read the fixed registry format written by community-agent-sync.mjs. */
export function parseQuestRegistry(content: string): RegistryTask[] {
  // Consume each complete quoted value before looking for the next field.
  // This keeps YAML examples inside Markdown from becoming tasks or metadata.
  const entries = [...content.matchAll(/^(  - id|    [a-z_]+):[ \t]*("(?:\\[\s\S]|[^"\\])*"|[^\n]*)/gm)];
  const tasks: RegistryTask[] = [];
  let task: RegistryTask | undefined;

  entries.forEach((entry, index) => {
    const name = entry[1].trim();
    if (name === "- id") {
      task = { fields: { id: decodeValue(entry[2]) }, references: [] };
      tasks.push(task);
    } else if (task) {
      task.fields[name] = decodeValue(entry[2]);
      if (name === "references") {
        const start = entry.index + entry[0].length;
        const end = entries[index + 1]?.index ?? content.length;
        task.references = [...content.slice(start, end).matchAll(/^      - ("(?:\\[\s\S]|[^"\\])*")/gm)]
          .map((reference) => decodeValue(reference[1])!);
      }
    }
  });

  return tasks;
}
