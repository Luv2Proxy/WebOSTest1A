import {RAM} from '../memory/RAM.js';
import {CPU} from '../cpu/CPU.js';
import {Terminal} from '../devices/Terminal.js';
import {Framebuffer} from '../devices/Framebuffer.js';
import {MEMORY_MAP} from '../memory/memoryMap.js';
export class Machine{
 constructor({onTerminal=()=>{},onFrame=()=>{}}={}){this.ram=new RAM(MEMORY_MAP.RAM_SIZE);this.terminal=new Terminal(onTerminal);this.framebuffer=new Framebuffer();this.cpu=new CPU({ram:this.ram,terminal:this.terminal,framebuffer:this.framebuffer});this.onFrame=onFrame;}
 reset(){this.cpu.reset();this.ram.clear();this.framebuffer.clear();}
 load(bytes){this.reset();this.ram.load(bytes,MEMORY_MAP.PROGRAM_START);this.cpu.pc=MEMORY_MAP.PROGRAM_START;this.cpu.halted=false;}
 step(){this.cpu.step();this.onFrame(this.framebuffer);}
 run(maxCycles=100000){this.cpu.run(maxCycles);this.onFrame(this.framebuffer);}
}
