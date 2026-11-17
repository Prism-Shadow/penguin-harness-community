import { QUEST_DOMAINS, resolveText, type QuestDomainId, type QuestItem } from "./community";
import type { Locale } from "./i18n";

export type Track = QuestDomainId;
export type State = "direction" | QuestItem["status"] | "review";
export interface MapNode {
  id: string; track: Track | ""; title: string; fullTitle?: string; kind: string; summary: string;
  stage: number; state: State; author?: string; links: {title: string; url: string}[];
}
export interface MapEdge { from: string; to: string; label: string; optional?: boolean }
export interface Atlas { nodes: MapNode[]; edges: MapEdge[]; statuses: Record<State,string> }

export function researchAtlas(quests: QuestItem[], locale: Locale): Atlas {
  const t = (zh:string,en:string) => locale === "zh" ? zh : en;
  const domainNames = new Map(QUEST_DOMAINS.map(d=>[d.id,d.label[locale]]));
  const statuses={direction:t("方向","Domain"),completed:t("已完成","Completed"),in_progress:t("进行中","In progress"),open:t("待认领","Open"),review:t("待复核","In review")};
  const nodes: MapNode[] = [{
    id:"rsi",track:"",title:t("RSI 社区","RSI community"),kind:t("社区成就树","Community achievement tree"),
    summary:t("查看社区五个方向的全部任务，点亮的徽章代表已完成的任务。","Explore every quest across five domains. Lit badges represent completed quests."),
    stage:0,state:"direction",links:[],
  }];
  for(const d of QUEST_DOMAINS){
    const group=quests.filter(q=>q.domain===d.id), done=group.filter(q=>q.status==="completed").length;
    nodes.push({id:d.id,track:d.id,title:d.label[locale],kind:t("任务分类","Quest domain"),
      summary:t(`本方向共登记 ${group.length} 项任务，其中 ${done} 项已完成。`,`${done} of ${group.length} registered quests in this domain are complete.`),
      stage:1,state:"direction",links:[]});
  }
  const short:Record<number,string>={
    39:t("50 个多领域基准任务","50 multi-domain tasks"),40:"GDPevo Essential",41:t("重复测量分析基准","Repeated-measures benchmark"),
    42:t("四种自进化算法对照","Four-method comparison"),43:t("四种 Harness 对照","Four-harness comparison"),
    50:t("公司模式沟通规范","Company communication rules"),71:"InfraRSI",75:t("HLE 进化前后挑战","HLE evolution challenge"),77:"HLE-Diamond",83:"NanoChat AutoResearch",
  };
  for(const q of [...quests].sort((a,b)=>a.issueNumber-b.issueNumber)){
    const fullTitle=resolveText(q.title,locale);
    const lines=resolveText(q.description,locale).split(/\r?\n/);
    // Keep the graph concise; the issue holds the full Markdown description.
    const first=(lines[0]||"").replace(/^["']|["']$/g,"").replace(/\[([^\]]+)\]\(https?:\/\/[^)]+\)/g,"$1").replace(/\*\*|`/g,"").trim();
    const summary=first.length>220 ? first.slice(0,217)+"…" : first;
    const links=[{title:"Issue #"+q.issueNumber,url:q.issueUrl}];
    if(q.linkedPr)links.push({title:"PR #"+q.linkedPr.split("/").pop(),url:q.linkedPr});
    for(const ref of q.references.filter(r=>r.url.startsWith("https://penguin.ooo/leaderboards/")))links.push({title:t("实验榜单 ↗","Leaderboard ↗"),url:ref.url});
    nodes.push({id:"q"+q.issueNumber,track:q.domain,title:short[q.issueNumber]||fullTitle,fullTitle,
      kind:domainNames.get(q.domain)!,summary,stage:2,state:q.status,author:q.assignee,links});
  }
  const ids=new Set(nodes.map(n=>n.id)), edges:MapEdge[]=[];
  if(ids.has("q71")){
    const url="https://github.com/Prism-Shadow/penguin-harness/pull/1551";
    nodes.push({id:"gpu",track:"rsi-algorithm",title:t("A100 训练实测","A100 training run"),kind:t("实验记录","Run report"),stage:3,state:"review",author:"Nhckdvrl",
      summary:t("作者报告在固定训练步数下复测得到 1.022×。微批大小从 32 恢复为上游默认的 128。该记录待复核。","The author reports 1.022× at a fixed step count. Micro-batch size went from 32 to the upstream default of 128. This report awaits review."),
      links:[{title:t("作者实测记录 ↗","Author’s run report ↗"),url:url+"#issuecomment-6936584572"},{title:t("评审要求 ↗","Review criteria ↗"),url:url+"#issuecomment-6910222523"}]});
    edges.push({from:"q71",to:"gpu",label:t("提交实测","Submitted run")});
  }
  for(const e of [{from:"q40",to:"q42",label:t("用于实验","Used in experiment")},{from:"q77",to:"q75",label:t("提供题集","Provides questions")},{from:"q71",to:"q83",optional:true,label:t("可选验证环境","Optional benchmark")}])
    if(ids.has(e.from)&&ids.has(e.to))edges.push(e);
  return {nodes,edges,statuses};
}
