import {System} from '../runtime/System.js';
import {InitProcess} from '../kernel/InitProcess.js';
export class UserOS {
  constructor({terminalRoot,canvas,onFrame=()=>{}}={}){this.terminalRoot=terminalRoot;this.canvas=canvas;this.onFrame=onFrame;this.system=new System({onOutput:text=>this.write(text),onFrame:fb=>this.renderFrame(fb)});this.init=null;this.running=false;}
  async boot(){this.write('VCPU-16 BIOS v0.2\n');this.write('Initializing hardware...\n');await this.system.boot();this.init=new InitProcess(this.system);await this.init.start();this.running=true;this.write('Boot complete.\n');}
  write(text){if(this.terminalRoot){const out=this.terminalRoot.querySelector('.terminal-output');if(out){out.textContent+=String(text);out.scrollTop=out.scrollHeight;}}}
  async command(line){if(!this.running)return 'System is still booting.';return this.init.command(line);}
  renderFrame(fb){if(!this.canvas||!fb?.pixels)return;const ctx=this.canvas.getContext('2d');const w=fb.width||320,h=fb.height||240;this.canvas.width=w;this.canvas.height=h;const img=ctx.createImageData(w,h);for(let i=0;i<w*h;i++){const on=fb.pixels[i];img.data[i*4]=on?80:8;img.data[i*4+1]=on?210:10;img.data[i*4+2]=on?255:18;img.data[i*4+3]=255;}ctx.putImageData(img,0,0);this.onFrame(fb);}
}