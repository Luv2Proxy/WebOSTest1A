import {Machine} from './runtime/Machine.js';
import {assemble} from './assembler/Assembler.js';
import {MEMORY_MAP} from './memory/memoryMap.js';

const examples={
'Hello World':`MOV R0, message\nloop:\nLOAD R1, [R0]\nCMP R1, 0\nJZ done\nOUT R1\nINC R0\nJMP loop\ndone:\nHALT\nmessage:\nDB "Hello from VCPU-16!\\n", 0`,
'Fibonacci':`MOV R0, 0\nMOV R1, 1\nMOV R2, 12\nloop:\nOUT R0\nADD R0, R1\nMOV R3, R0\nSUB R3, R1\nMOV R1, R0\nMOV R0, R3\nDEC R2\nJNZ loop\nHALT`,
'Factorial':`MOV R0, 5\nMOV R1, 1\nloop:\nMUL R1, R0\nDEC R0\nJNZ loop\nOUT R1\nHALT`,
'Countdown':`MOV R0, 10\nloop:\nOUT R0\nDEC R0\nJNZ loop\nHALT`,
'Arithmetic':`MOV R0, 12\nMOV R1, 7\nADD R0, R1\nOUT R0\nMOV R2, 6\nMUL R0, R2\nOUT R0\nMOV R3, 3\nDIV R0, R3\nOUT R0\nHALT`,
'Graphics':`MOV R0, 0\nloop:\nMOV R1, 0xA000\nMOV R2, R0\nMUL R2, 320\nADD R1, R2\nADD R1, R0\nMOV R2, 1\nSTORE [R1], R2\nINC R0\nCMP R0, 200\nJNZ loop\nHALT`
};

const $=id=>document.getElementById(id);
const source=$('source'),terminal=$('terminal'),log=$('log'),status=$('status'),canvas=$('canvas'),ctx=canvas.getContext('2d'),select=$('exampleSelect');
let machine;
let timer=null;
function writeTerminal(c){terminal.textContent+=c;terminal.scrollTop=terminal.scrollHeight;}
function logLine(s){log.textContent+=s+'\n';log.scrollTop=log.scrollHeight;}
function draw(fb){const img=ctx.createImageData(320,240);for(let i=0;i<img.data.length;i+=4){const on=fb.pixels[i/4];img.data[i]=on?80:5;img.data[i+1]=on?210:8;img.data[i+2]=on?255:12;img.data[i+3]=255;}ctx.putImageData(img,0,0);}
function refresh(){const c=machine.cpu;let h='';for(let i=0;i<8;i++)h+=`<div class="reg"><span>R${i}</span><span>0x${c.reg[i].toString(16).padStart(4,'0').toUpperCase()} (${c.reg[i]})</span></div>`;h+=`<div class="reg"><span>PC</span><span>0x${c.pc.toString(16).padStart(4,'0').toUpperCase()}</span></div><div class="reg"><span>SP</span><span>0x${c.sp.toString(16).padStart(4,'0').toUpperCase()}</span></div><div class="reg"><span>CYCLES</span><span>${c.cycles}</span></div><div class="reg"><span>LAST</span><span>${c.lastInstruction}</span></div>`;$('registers').innerHTML=h;$('flags').innerHTML=Object.entries(c.flags).map(([k,v])=>`<div class="flag ${v?'on':''}">${k}: ${v?1:0}</div>`).join('');let s='';for(let i=0;i<10;i++){const a=(c.sp+i*2)&0xFFFF;s+=`<div class="stack-item">0x${a.toString(16).padStart(4,'0')} → 0x${c.read16(a).toString(16).padStart(4,'0')}</div>`;}$('stack').innerHTML=s;let m='';const start=Math.max(0,c.pc-32),end=Math.min(0x10000,c.pc+96);for(let a=start;a<end;a+=16){let hx=[],as='';for(let j=0;j<16;j++){const b=c.read8(a+j);hx.push(b.toString(16).padStart(2,'0'));as+=b>=32&&b<127?String.fromCharCode(b):'.';}m+=a.toString(16).padStart(4,'0')+'  '+hx.join(' ')+'  |'+as+'|\n';}$('memory').textContent=m;draw(machine.framebuffer);status.textContent=c.halted?'HALTED':'RUNNING';}
function stop(){if(timer){clearInterval(timer);timer=null;}}
function assembleCurrent(){try{const r=assemble(source.value);machine.load(r.bytes);terminal.textContent='';log.textContent='';logLine(`Assembled ${r.bytes.length} bytes at 0x${MEMORY_MAP.PROGRAM_START.toString(16)}.`);refresh();return true;}catch(e){logLine('ASSEMBLER ERROR: '+e.message);status.textContent='ERROR';return false;}}
function run(){stop();machine.cpu.halted=false;timer=setInterval(()=>{try{let n=0;while(!machine.cpu.halted&&n++<5000)machine.step();refresh();if(machine.cpu.halted){stop();logLine(`CPU halted after ${machine.cpu.cycles} cycles.`);}}catch(e){machine.cpu.halted=true;stop();logLine('CPU FAULT: '+e.message);refresh();}},1);}
function load(name){stop();source.value=examples[name];machine.reset();terminal.textContent='';log.textContent='';status.textContent='READY';refresh();}
for(const name of Object.keys(examples)){const o=document.createElement('option');o.value=name;o.textContent=name;select.appendChild(o);const b=document.createElement('button');b.textContent=name;b.onclick=()=>load(name);$('programs').appendChild(b);}
machine=new Machine({onTerminal:writeTerminal,onFrame:draw});select.value='Hello World';load('Hello World');
$('loadExample').onclick=()=>load(select.value);$('assemble').onclick=assembleCurrent;$('run').onclick=()=>{if(machine.cpu.halted)if(!assembleCurrent())return;run();};$('pause').onclick=()=>{stop();machine.cpu.halted=true;refresh();};$('step').onclick=()=>{stop();if(machine.cpu.halted&&!assembleCurrent())return;try{machine.cpu.halted=false;machine.step();machine.cpu.halted=true;refresh();}catch(e){logLine('CPU FAULT: '+e.message);machine.cpu.halted=true;refresh();}};$('reset').onclick=()=>{stop();machine.reset();terminal.textContent='';log.textContent='CPU reset.';refresh();};
source.addEventListener('keydown',e=>{if(e.key==='Tab'){e.preventDefault();const p=source.selectionStart;source.value=source.value.slice(0,p)+'    '+source.value.slice(source.selectionEnd);source.selectionStart=source.selectionEnd=p+4;}});document.addEventListener('keydown',e=>{if(e.ctrlKey&&e.key==='Enter'){e.preventDefault();if(assembleCurrent())run();}});
