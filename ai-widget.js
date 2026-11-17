(async function(){

const API =
"https://teledentalrwanda.sangoblaise51.workers.dev";

try{

const response =
await fetch(
API + "/ai-settings"
);

const settings =
await response.json();

if(!settings || settings.enabled == 0){
return;
}

const html = `

<div id="td-ai-orb">
🤖
</div>

<div id="td-ai-panel">

<div id="td-ai-header">

<div class="td-ai-profile">

<img
src="images/teledent-ai.png"
class="td-ai-avatar">

<div>

<div class="td-ai-name">
${settings.assistant_name}
</div>

<div class="td-ai-status">
🟢 Online
</div>

</div>

</div>

<div id="td-ai-close">
✕
</div>

</div>

<div id="td-ai-messages">

<div class="td-ai-bot">

${settings.welcome_message}

</div>

</div>

<div id="td-ai-input-area">

<input
id="td-ai-input"
placeholder="Ask TeleDent AI...">

<input
type="file"
id="td-ai-image"
accept="image/*"
hidden>

<button id="td-ai-upload">
📷
</button>

<button id="td-ai-mic">
🎤
</button>

<button id="td-ai-send">
➤
</button>

</div>

</div>

`;

document.body.insertAdjacentHTML(
"beforeend",
html
);

const style =
document.createElement("style");

style.innerHTML = `

#td-ai-orb{
position:fixed;
bottom:20px;
right:20px;
width:50px;
height:50px;
border-radius:50%;
background:
linear-gradient(
135deg,
#5e00ff,
#001c7a
);

display:flex;
align-items:center;
justify-content:center;
font-size:28px;
font-weight:bold;
color:white;
cursor:pointer;
z-index:9999;
border:3px solid white;
box-shadow:
0 0 20px rgba(94,0,255,.5);

}

#td-ai-panel{
position:fixed;
bottom:100px;
right:20px;
width:370px;
height:470px;
background:white;
border-radius:20px;
display:none;
flex-direction:column;
overflow:hidden;
box-shadow:
0 15px 40px rgba(0,0,0,.25);
z-index:9999;

}

#td-ai-header{
background:${settings.theme_color};
color:white;
padding:18px;
display:flex;
justify-content:space-between;
align-items:center;
font-weight:bold;

}

#td-ai-close{
cursor:pointer;

}

#td-ai-messages{
flex:1;
padding:15px;
overflow-y:auto;
background:#f5f7fb;

}

.td-ai-bot{
background:white;
padding:15px;
border-radius:15px;
margin-bottom:10px;
max-width:85%;

}

.td-ai-user{
background:#2575fc;
color:white;
padding:15px;
border-radius:15px;
margin-left:auto;
margin-bottom:10px;
max-width:85%;

}

#td-ai-input-area{
display:flex;
padding:12px;
border-top:1px solid #ddd;
background:white;

}

#td-ai-input{
flex:1;
padding:12px;
border:1px solid #ddd;
border-radius:10px;

}

#td-ai-send{
margin-left:10px;
padding:12px 18px;
border:none;
border-radius:10px;
background:${settings.theme_color};
color:white;
cursor:pointer;

}

.td-ai-profile{
display:flex;
align-items:center;
gap:10px;

}

.td-ai-avatar{
width:45px;
height:45px;
border-radius:50%;
object-fit:cover;
border:2px solid white;

}

.td-ai-name{
font-size:16px;
font-weight:bold;

}

.td-ai-status{
font-size:12px;
opacity:.9;

}

#td-ai-upload,
#td-ai-mic{
padding:12px;
margin-left:5px;
border:none;
border-radius:10px;
cursor:pointer;
background:#f3f3f3;

}

#td-ai-upload:hover,
#td-ai-mic:hover{

background:#e5e5e5;

}

@media(max-width:768px){

#td-ai-panel{
width:95%;
right:2.5%;
height:70vh;

}

}

`;

document.head.appendChild(style);

const orb =
document.getElementById(
"td-ai-orb"
);

const panel =
document.getElementById(
"td-ai-panel"
);

orb.onclick = ()=>{

panel.style.display="flex";

};

document.getElementById(
"td-ai-close"
).onclick = ()=>{

panel.style.display="none";

};

document.getElementById(
"td-ai-send"
).onclick = askAI;

document
.getElementById(
"td-ai-upload"
)
.onclick = ()=>{

document
.getElementById(
"td-ai-image"
)
.click();

};

document.getElementById(
"td-ai-input"
).addEventListener(
"keydown",
e=>{
if(e.key==="Enter"){
askAI();
}
});

document
.getElementById(
"td-ai-image"
)
.addEventListener(
"change",
function(){

const file =
this.files[0];

if(!file) return;

const reader =
new FileReader();

reader.onload =
function(e){

document
.getElementById(
"td-ai-messages"
)
.innerHTML += `

<div class="td-ai-user">

<img
src="${e.target.result}"
style="
max-width:220px;
border-radius:10px;
">

</div>

`;

};

reader.readAsDataURL(
file
);

});

if(
'webkitSpeechRecognition'
in window
){

const recognition =
new SpeechRecognition();
const SpeechRecognition =
window.SpeechRecognition ||
new SpeechRecognition();

recognition.lang =
"en-US";

document
.getElementById(
"td-ai-mic"
)
.onclick = ()=>{

recognition.start();

};

recognition.onresult =
(event)=>{

document
.getElementById(
"td-ai-input"
)
.value =

event.results[0][0]
.transcript;

};

}

async function askAI(){

const input =
document.getElementById(
"td-ai-input"
);

const text =
input.value.trim();

if(!text) return;

const messages =
document.getElementById(
"td-ai-messages"
);

messages.innerHTML += `

<div class="td-ai-user">

${text}

</div>

`;

input.value="";

const res =
await fetch(
API + "/ai-chat",
{
method:"POST",
headers:{
"Content-Type":
"application/json"
},
body:JSON.stringify({
message:text
})
}
);

const data =
await res.json();

messages.innerHTML += `

<div class="td-ai-bot">

${data.reply}

</div>

`;

if(
"speechSynthesis"
in window
){

const speech =
new SpeechSynthesisUtterance(
data.reply
);

speech.lang =
"en-US";

speechSynthesis.speak(
speech
);

}

messages.scrollTop =
messages.scrollHeight;

}

}catch(err){

console.error(
"AI Widget Error",
err
);

}

})();