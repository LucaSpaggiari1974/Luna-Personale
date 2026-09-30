import express from "express";
const app=express();
app.use(express.json({limit:"1mb"}));
const PORT=process.env.PORT||8787;
const BASE=(process.env.MODEL_API_BASE_URL||"").replace(/\/$/,"");
const KEY=process.env.MODEL_API_KEY||"";
const MODEL=process.env.MODEL_NAME||"llama3.1";
app.get("/health",(req,res)=>res.json({ok:true,service:"luna-backend"}));
app.post("/v1/chat/completions",async(req,res)=>{
  if(!BASE)return res.status(503).json({error:"MODEL_API_BASE_URL non configurato"});
  try{
    const upstream=await fetch(BASE+"/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",...(KEY?{"Authorization":"Bearer "+KEY}:{})},body:JSON.stringify({...req.body,model:req.body.model||MODEL})});
    const body=await upstream.text();
    res.status(upstream.status).type("application/json").send(body);
  }catch(e){res.status(502).json({error:"Modello non raggiungibile"});}
});
app.listen(PORT,()=>console.log("Luna backend on "+PORT));