import {assemble} from '../assembler/Assembler.js';
export class ProgramLoader{
 constructor(kernel){this.kernel=kernel;}
 async loadAssembly(path,source,{origin=0x1000,name=path}={}){const image=assemble(source,{origin});this.kernel.machine.ram.load(image.bytes,origin);return this.kernel.spawn(origin,name);}
 async loadFile(path,options={}){const source=await this.kernel.fs.readFile(path);return this.loadAssembly(path,source,options);}
}