// Loni voice (v0.33.2): same API as before (init, synth, phon, SAMPLE_RATE), but the engine
// runs in a background Web Worker so the page never freezes while Loni's voice loads or speaks.
export const SAMPLE_RATE=24000;
let wk=null,seq=0,ready=null;const pend=new Map();
function call(op,args,onp){return new Promise((res,rej)=>{const id=++seq;pend.set(id,{res,rej,onp});wk.postMessage({id,op,args})})}
export function init(base,onp){
  if(ready)return ready;
  ready=(async()=>{
    base=new URL(base,location.href).href;
    // Load the worker from a blob so it also works when the page is opened from a local file.
    const code=await fetch(base+'vendor/loni-voice-worker.js').then(r=>{if(!r.ok)throw new Error('worker '+r.status);return r.text()});
    wk=new Worker(URL.createObjectURL(new Blob([code],{type:'text/javascript'})),{type:'module'});
    wk.onmessage=(e)=>{const m=e.data,p=pend.get(m.id);if(!p)return;if('progress' in m){p.onp&&p.onp(m.progress);return}pend.delete(m.id);m.ok?p.res(m.result):p.rej(new Error(m.error))};
    wk.onerror=(e)=>{const err=new Error('voice worker: '+(e.message||'failed'));pend.forEach(p=>p.rej(err));pend.clear()};
    await call('init',[base],onp);return true})();
  return ready}
export async function synth(text,speed=1){await ready;return call('synth',[text,speed])}
export async function phon(text){await ready;return call('phon',[text])}
