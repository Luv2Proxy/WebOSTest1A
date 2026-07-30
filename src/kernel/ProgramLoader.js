import {assemble} from '../assembler/Assembler.js';
export class ProgramLoader{
 constructor(kernel){this.kernel=kernel;}
 async loadAssembly(path,source,{origin=0x1000,name=path}={}){const image=assemble(source,{origin});this.kernel.machine.ram.load(image.bytes,origin);const pid=this.kernel.spawn(origin,name);const process=this.kernel.processes.get(pid);process.image={path,origin,size:image.bytes.length,labels:image.labels};return pid;}
 async loadFile(path,options={}){const source=await this.kernel.fs.readFile(path);return this.loadAssembly(path,source,options);}
}