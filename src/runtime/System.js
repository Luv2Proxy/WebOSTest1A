import {RAM} from '../memory/RAM.js';
import {CPU} from '../cpu/CPU.js';
import {Terminal} from '../devices/Terminal.js';
import {Framebuffer} from '../devices/Framebuffer.js';
import {Keyboard} from '../devices/Keyboard.js';
import {Timer} from '../devices/Timer.js';
import {InterruptController} from '../devices/InterruptController.js';
import {MMU} from '../memory/MMU.js';
import {BIOS} from './BIOS.js';
import {Kernel} from '../kernel/Kernel.js';
import {Shell} from '../kernel/Shell.js';
import {Loader} from './Loader.js';
import {ProcessRunner} from '../kernel/ProcessRunner.js';

export class System {
 constructor({onOutput=()=>{},onFrame=()=>{}}={}){
  this.interrupts=new InterruptController();this.terminal=new Terminal(onOutput);this.framebuffer=new Framebuffer();this.keyboard=new Keyboard();this.timer=new Timer(this.interrupts);this.ram=new RAM(0x10000);this.mmu=new MMU(this.ram,{terminal:this.terminal,framebuffer:this.framebuffer,timer:this.timer});this.cpu=new CPU({ram:this.ram,terminal:this.terminal,framebuffer:this.framebuffer});this.bios=new BIOS(this);this.kernel=new Kernel(this);this.shell=new Shell(this.kernel);this.loader=new Loader(this,this.kernel.fs);this.runner=new ProcessRunner(this,this.kernel.processes,this.kernel.scheduler);this.onFrame=onFrame;this.booted=false;
 }
 reset(){this.cpu.reset();this.ram.clear();this.framebuffer.clear();this.interrupts.clear();this.kernel.fs=new this.kernel.fs.constructor();this.booted=false;}
 boot(){this.reset();this.kernel.boot();this.booted=true;return this;}
 tick(){this.timer.update();this.runner.runTick();this.onFrame(this.framebuffer);}
 executeCommand(command){return this.shell.execute(command);}
}
