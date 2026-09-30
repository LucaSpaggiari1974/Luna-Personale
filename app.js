const chat=document.querySelector("#chat"),input=document.querySelector("#input");
let messages=JSON.parse(localStorage.getItem("luna_messages")||"[]");
function bubble(role,text){const d=document.createElement("div");d.className="bubble "+role;d.textContent=text;chat.appendChild(d);chat.scrollTop=chat.scrollHeight}
messages.forEach(m=>bubble(m.role==="user"?"user":"assistant",m.content));
async function send(text){
 if(!text.trim())return;
 bubble("user",text);messages.push({role:"user",content:text});localStorage.setItem("luna_messages",JSON.stringify(messages));input.value="";
 bubble("assistant","Sto elaborando…");const loading=chat.lastChild;
 try{
  const r=await fetch("/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"system",content:"Sei Luna, assistente personale italiana: diretta, naturale, pratica e rispettosa dell'autonomia dell'utente."},...messages]})});
  const j=await r.json();loading.remove();
  const answer=j.choices?.[0]?.message?.content||j.error?.message||"Risposta non disponibile.";
  bubble("assistant",answer);messages.push({role:"assistant",content:answer});localStorage.setItem("luna_messages",JSON.stringify(messages));
 }catch(e){loading.textContent="Backend Luna non ancora collegato."}
}
document.querySelector("#composer").onsubmit=e=>{e.preventDefault();send(input.value)};