import * as ort from 'onnxruntime-web/wasm';
import {phonemize as l} from 'phonemizer';
function o(e){if(e.includes("."))return e;if(e.includes(":")){let[a,t]=e.split(":").map(Number);return 0===t?`${a} o'clock`:t<10?`${a} oh ${t}`:`${a} ${t}`}let a=parseInt(e.slice(0,4),10);if(a<1100||a%1e3<10)return e;let t=e.slice(0,2),r=parseInt(e.slice(2,4),10),n=e.endsWith("s")?"s":"";if(a%1e3>=100&&a%1e3<=999){if(0===r)return`${t} hundred${n}`;if(r<10)return`${t} oh ${r}${n}`}return`${t} ${r}${n}`}function c(e){const a="$"===e[0]?"dollar":"pound";if(isNaN(Number(e.slice(1))))return`${e.slice(1)} ${a}s`;if(!e.includes(".")){let t="1"===e.slice(1)?"":"s";return`${e.slice(1)} ${a}${t}`}const[t,r]=e.slice(1).split("."),n=parseInt(r.padEnd(2,"0"),10);return`${t} ${a}${"1"===t?"":"s"} and ${n} ${"$"===e[0]?1===n?"cent":"cents":1===n?"penny":"pence"}`}function g(e){let[a,t]=e.split(".");return`${a} point ${t.split("").join(" ")}`}const u=new RegExp(`(\\s*[${d=';:,.!?¡¿—…"«»“”(){}[]',d.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}]+\\s*)+`,"g");var d;async function m(e,a="a",t=!0){t&&(e=function(e){return e.replace(/[‘’]/g,"'").replace(/«/g,"“").replace(/»/g,"”").replace(/[“”]/g,'"').replace(/\(/g,"«").replace(/\)/g,"»").replace(/、/g,", ").replace(/。/g,". ").replace(/！/g,"! ").replace(/，/g,", ").replace(/：/g,": ").replace(/；/g,"; ").replace(/？/g,"? ").replace(/[^\S \n]/g," ").replace(/  +/," ").replace(/(?<=\n) +(?=\n)/g,"").replace(/\bD[Rr]\.(?= [A-Z])/g,"Doctor").replace(/\b(?:Mr\.|MR\.(?= [A-Z]))/g,"Mister").replace(/\b(?:Ms\.|MS\.(?= [A-Z]))/g,"Miss").replace(/\b(?:Mrs\.|MRS\.(?= [A-Z]))/g,"Mrs").replace(/\betc\.(?! [A-Z])/gi,"etc").replace(/\b(y)eah?\b/gi,"$1e'a").replace(/\d*\.\d+|\b\d{4}s?\b|(?<!:)\b(?:[1-9]|1[0-2]):[0-5]\d\b(?!:)/g,o).replace(/(?<=\d),(?=\d)/g,"").replace(/[$£]\d+(?:\.\d+)?(?: hundred| thousand| (?:[bm]|tr)illion)*\b|[$£]\d+\.\d\d?\b/gi,c).replace(/\d*\.\d+/g,g).replace(/(?<=\d)-(?=\d)/g," to ").replace(/(?<=\d)S/g," S").replace(/(?<=[BCDFGHJ-NP-TV-Z])'?s\b/g,"'S").replace(/(?<=X')S\b/g,"s").replace(/(?:[A-Za-z]\.){2,} [a-z]/g,(e=>e.replace(/\./g,"-"))).replace(/(?<=[A-Z])\.(?=[A-Z])/gi,"-").trim()}(e));const r=function(e,a){const t=[];let r=0;for(const n of e.matchAll(a)){const a=n[0];r<n.index&&t.push({match:!1,text:e.slice(r,n.index)}),a.length>0&&t.push({match:!0,text:a}),r=n.index+a.length}return r<e.length&&t.push({match:!1,text:e.slice(r)}),t}(e,u),n="a"===a?"en-us":"en",s=(await Promise.all(r.map((async({match:e,text:a})=>e?a:(await l(a,n)).join(" "))))).join("");let i=s.replace(/kəkˈoːɹoʊ/g,"kˈoʊkəɹoʊ").replace(/kəkˈɔːɹəʊ/g,"kˈəʊkəɹəʊ").replace(/ʲ/g,"j").replace(/r/g,"ɹ").replace(/x/g,"k").replace(/ɬ/g,"l").replace(/(?<=[a-zɹː])(?=hˈʌndɹɪd)/g," ").replace(/ z(?=[;:,.!?¡¿—…"«»“” ]|$)/g,"z");return"a"===a&&(i=i.replace(/(?<=nˈaɪn)ti(?!ː)/g,"di")),i.trim()}
let sess=null,vocab=null,voice=null,ready=null;
async function getBuf(url,onp){const r=await fetch(url);if(!r.ok)throw new Error(url+' '+r.status);const tot=+r.headers.get('content-length')||0;if(!r.body||!tot||!onp)return new Uint8Array(await r.arrayBuffer());const rd=r.body.getReader();const buf=new Uint8Array(tot);let got=0;for(;;){const {done,value}=await rd.read();if(done)break;buf.set(value,got);got+=value.length;onp(got/tot)}return got===tot?buf:buf.slice(0,got)}
export function init(base,onp){
  if(ready) return ready;
  ready=(async()=>{
    base=new URL(base,location.href).href;ort.env.wasm.wasmPaths=base+'vendor/ort/';
    ort.env.wasm.numThreads=(self.crossOriginIsolated?Math.min(4,navigator.hardwareConcurrency||2):1);
    const [v,w]=await Promise.all([fetch(base+'models/kokoro/vocab.json').then(r=>r.json()),fetch(base+'models/kokoro/af_heart.bin').then(r=>{if(!r.ok)throw new Error('voice '+r.status);return r.arrayBuffer()})]);
    vocab=v;voice=new Float32Array(w);
    const mb=await getBuf(base+'models/kokoro/kokoro-v1.0.int8.onnx',onp);sess=await ort.InferenceSession.create(mb,{executionProviders:['wasm'],graphOptimizationLevel:'all'});
    return true})();
  return ready}
export async function phon(text){return m(text,'a')}
export async function synth(text,speed=1){
  await ready;
  const p=await m(text,'a');
  const ids=[...p].map(c=>vocab[c]).filter(x=>x!==undefined).slice(0,510);
  const k=Math.min(ids.length,509);
  const style=voice.slice(k*256,(k+1)*256);
  const toks=[0,...ids,0];
  const out=await sess.run({tokens:new ort.Tensor('int64',BigInt64Array.from(toks.map(BigInt)),[1,toks.length]),style:new ort.Tensor('float32',style,[1,256]),speed:new ort.Tensor('float32',new Float32Array([speed]),[1])});
  return out.audio.data}
export const SAMPLE_RATE=24000;
