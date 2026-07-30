import {assemble} from '../assembler/Assembler.js';
export class Loader{
 constructor(machine,fs){this.machine=machine;this.fs=fs;}
 loadAssembly(source,options={}){return assemble(source,options);}
 loadFile(path,options={}){return this.loadAssembly(this.fs.readFile(path),options);}
 install(path,source){return this.fs.writeFile(path,source);}
 loadBinary(bytes,start=0x1000){this.machine.ram.load(bytes,start);return bytes;}
 bootAssembly(source,{origin=0x1000,entry=origin}={}){const image=this.loadAssembly(source,{origin});this.loadBinary(image.bytes,origin);this.machine.cpu.pc=entry;this.machine.cpu.sp=0x7FFF00;this.machine.cpu.halted=false;return image;}
 bootFile(path,options={}){return this.bootAssembly(this.fs.readFile(path),options);}
}