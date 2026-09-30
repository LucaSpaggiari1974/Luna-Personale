const chat=document.querySelector("#chat"),input=document.querySelector("#input"),status=document.querySelector("#status");
let messages=JSON.parse(localStorage.getItem("luna_messages")||"[]");
function bubble(role,text){const d=document.createElement("div");d.className="bubble "+role;d.textContent=text;chat.appendChild(d);chat.scrollTop=chat.scrollHeight}
messages.forEach(m=>bubble(m.role==="user"?"user":"assistant",m.content));
const isStaticPreview=location.hostname.endsWith("github.io");
const demoReply=t=>{const q=t.toLowerCase();if(q.includes("aggiorn"))return "Modalità demo attiva. Il nucleo di aggiornamento è predisposto per collegare il backend alle fonti verificate e registrare data e ora dell'ultimo aggiornamento.";if(q.includes("ciao")||q.includes("buongiorno"))return "Ciao. Sono Luna. Questa è l'anteprima funzionante del progetto.";return "Ho ricevuto la richiesta. Il frontend è operativo; in modalità demo questa risposta viene simulata. Il collegamento al backend/API verrà usato quando il server sarà configurato.";};
async function send(text){
 if(!text.trim())return;
 bubble("user",text);messages.push({role:"user",content:text});localStorage.setItem("luna_messages",JSON.stringify(messages));input.value="";
 bubble("assistant","Sto elaborando…");const loading=chat.lastChild;
 try{
  if(isStaticPreview){await new Promise(r=>setTimeout(r,450));loading.remove();const answer=demoReply(text);bubble("assistant",answer);messages.push({role:"assistant",content:answer});localStorage.setItem("luna_messages",JSON.stringify(messages));status.textContent="● Demo attiva";return;}
  const r=await fetch("/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"system",content:"Sei Luna, assistente personale italiana: diretta, naturale, pratica e rispettosa dell'autonomia dell'utente."},...messages]})});
  const j=await r.json();loading.remove();const answer=j.choices?.[0]?.message?.content||j.error?.message||"Risposta non disponibile.";bubble("assistant",answer);messages.push({role:"assistant",content:answer});localStorage.setItem("luna_messages",JSON.stringify(messages));status.textContent="● API collegata";
 }catch(e){loading.textContent="API non raggiungibile. La modalità demo resta disponibile.";status.textContent="● API offline"}
}
document.querySelector("#composer").onsubmit=e=>{e.preventDefault();send(input.value)};