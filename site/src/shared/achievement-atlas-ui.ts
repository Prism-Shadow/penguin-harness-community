import type {Atlas, MapNode} from "./achievements";

export function initAtlas(root: HTMLDetailsElement) {
  const {nodes,edges,statuses,words} = JSON.parse(root.dataset.model!) as Atlas & {words:Record<string,string>};
  const get = <T extends HTMLElement = HTMLElement>(attr:string) => root.querySelector<T>(`[data-${attr}]`)!;
  const byId = new Map(nodes.map(n=>[n.id,n]));
  const filters=Array.from(root.querySelectorAll<HTMLButtonElement>("[data-filter]"));
  const statusBranches=Array.from(root.querySelectorAll<HTMLElement>("[data-status-branch]"));
  const dialog=get<HTMLDialogElement>("detail");
  const viewport=get("scroll"), panTools=get("pan-tools");
  const prev=get<HTMLButtonElement>("pan-left"), next=get<HTMLButtonElement>("pan-right");
  function syncPan(){
    const end=viewport.scrollWidth-viewport.clientWidth;
    panTools.hidden=end<=1;
    prev.disabled=viewport.scrollLeft<=1;
    next.disabled=viewport.scrollLeft>=end-1;
  }
  function pan(dir:number){
    const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    viewport.scrollBy({left:dir*viewport.clientWidth*.72,behavior:reduce?"instant":"smooth"});
  }
  prev.addEventListener("click",()=>pan(-1));next.addEventListener("click",()=>pan(1));
  viewport.addEventListener("scroll",syncPan,{passive:true});
  const observer=new ResizeObserver(syncPan);
  observer.observe(viewport);observer.observe(viewport.firstElementChild!);
  root.addEventListener("toggle",syncPan);
  syncPan();

  for (const button of filters) button.addEventListener("click",()=>{
    const state=button.dataset.filter!;
    filters.forEach(b=>b.setAttribute("aria-pressed",String(b===button)));
    let total=0;
    for(const branch of statusBranches){
      branch.hidden=state!=="all" && branch.dataset.statusBranch!==state;
      if(!branch.hidden)total+=Number(branch.dataset.count);
    }
    viewport.scrollLeft=0;syncPan();
    get("live").textContent=`${state==="all"?words.all:statuses[state as MapNode["state"]]} · ${total} ${words.results}`;
  });

  function show(n:MapNode){
    get("status").textContent=n.kind+" · "+statuses[n.state];
    get("title").textContent=n.fullTitle||n.title;
    get("summary").textContent=n.summary;
    const facts=get("facts"),related=get("neighbors");facts.replaceChildren();related.replaceChildren();
    for(const link of n.links){
      const a=document.createElement("a");a.href=link.url;a.target="_blank";a.rel="noopener noreferrer";a.textContent=link.title;facts.append(a);
    }
    if(n.author){const by=document.createElement("span");by.textContent=words.author+" · @"+n.author;facts.append(by);}
    for(const e of edges.filter(e=>e.from===n.id||e.to===n.id)){
      const other=byId.get(e.from===n.id?e.to:e.from);
      if(!other)continue;
      const link=document.createElement("button");link.type="button";link.textContent=e.label+" · "+other.title;
      link.addEventListener("click",()=>show(other));related.append(link);
    }
    if(!dialog.open)dialog.showModal();
    else get("close").focus({preventScroll:true});
  }
  for (const a of root.querySelectorAll<HTMLAnchorElement>("[data-record]")){
    a.setAttribute("aria-haspopup","dialog");
    a.addEventListener("click",e=>{
      if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
      const n=byId.get(a.dataset.record!);if(n){e.preventDefault();show(n);}
    });
  }
  get("close").addEventListener("click",()=>dialog.close());
  let backdrop=false;
  dialog.addEventListener("pointerdown",e=>{backdrop=e.target===dialog});
  dialog.addEventListener("click",e=>{if(backdrop&&e.target===dialog)dialog.close()});
}
