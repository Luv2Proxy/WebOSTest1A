import {assemble} from '../assembler/Assembler.js';import {ProcessMemory} from './ProcessMemory.js';
export class ProgramLoader{
 constructor(kernel){this.kernel=kernel;}
 async loadAssembly(path,source,{origin=0x1000,name=path}={}){const image=assemble(source,{origin});const pid=this.kernel.spawn(origin,name);const process=this.kernel.processes.get(pid);process.memory=new ProcessMemory(this.kernel.vmm,process);process.memory.map(origin,Math.max(4096,Math.ceil(image.bytes.length/4096)*4096),'rwx',true);process.memory.load(image.bytes,origin);process.image={path,origin,size:image.bytes.length,labels:image.labels};return pid;}
 async loadFile(path,options={}){const source=await this.kernel.fs.readFile(path);return this.loadAssembly(path,source,options);}
}