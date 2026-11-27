// Loni voice worker: runs the Kokoro engine off the page's main thread (v0.33.2).
import {init,synth,phon,SAMPLE_RATE} from '../src.js';
self.onmessage=async(e)=>{const {id,op,args}=e.data;
  try{
    if(op==='init'){await init(args[0],p=>self.postMessage({id,progress:p}));self.postMessage({id,ok:true,result:true})}
    else if(op==='synth'){const a=await synth(args[0],args[1]);const out=new Float32Array(a);self.postMessage({id,ok:true,result:out},[out.buffer])}
    else if(op==='phon'){self.postMessage({id,ok:true,result:await phon(args[0])})}
  }catch(err){self.postMessage({id,ok:false,error:String(err&&err.stack||err)})}};
