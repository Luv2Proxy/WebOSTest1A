import {assemble} from '../assembler/Assembler.js';import {ProcessMemory} from './ProcessMemory.js';
export class ProgramLoader{
 constructor(kernel){this.kernel=kernel;}
 async loadAssembly(path,source,{origin=0x1000,name=path}={}){
  const image=assemble(source,{origin});
  const pid=this.kernel.spawn(origin,name);
  const process=this.kernel.processes.get(pid);
  const codeSize=Math.max(4096,Math.ceil(image.bytes.length/4096)*4096);
  const existing=process.memory.space.regions.find(r=>r.virtual===origin&&r.size===0x100000);
  if(existing)process.memory.unmap(origin,0x100000);
  process.memory.map(origin,codeSize,'rw-',true);
  process.memory.load(image.bytes,origin);
  process.memory.unmap(origin,codeSize);
  process.memory.map(origin,codeSize,'r-x',true);
  process.image={path,origin,size:image.bytes.length,labels:image.labels,entry:origin};
  process.pc=origin;
  return pid;
 }
 async loadFile(path,options={}){const source=await this.kernel.fs.readFile(path);return this.loadAssembly(path,source,options);}
}