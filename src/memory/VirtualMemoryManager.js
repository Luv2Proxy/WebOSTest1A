import {PhysicalMemory} from './PhysicalMemory.js';import {PageTable} from './PageTable.js';
export class VirtualMemoryManager {
 constructor(ram,{pageSize=4096}={}){this.ram=ram;this.physical=new PhysicalMemory(ram.size,pageSize);this.pageSize=pageSize;this.kernel=new PageTable(pageSize);this.spaces=new Map();this.current=null;this.physical.reserve(0,0x1FFF);this.physical.reserve(0x800000,ram.size-1);}
 align(n){return (Number(n)+this.pageSize-1)&~(this.pageSize-1);}
 createSpace(pid){const s={pid,pageTable:new PageTable(this.pageSize),regions:[]};this.spaces.set(pid,s);return s;}
 destroySpace(space){if(!space)return;for(const r of [...space.regions])this.unmap(space,r.virtual,r.size);this.spaces.delete(space.pid);if(this.current===space)this.current=null;}
 map(space,virtual,size,permissions='rwx',user=true){const start=Number(virtual)>>>0,n=this.align(size);if(!n||start+n>this.ram.size)throw new Error('Invalid virtual memory mapping');if(space.regions.some(r=>start<r.virtual+r.size&&start+n>r.virtual))throw new Error('Virtual memory overlap');const count=n/this.pageSize,physical=this.physical.allocMany(count);for(let i=0;i<count;i++)space.pageTable.map(start+i*this.pageSize,physical[i],permissions,user);space.regions.push({virtual:start,size:n,permissions,user,physical});return start;}
 unmap(space,virtual,size){const start=Number(virtual)>>>0,n=this.align(size),region=space.regions.find(r=>r.virtual===start&&r.size===n);if(!region)return false;for(let i=0;i<region.physical.length;i++)space.pageTable.unmap(start+i*this.pageSize);for(const p of region.physical)this.physical.release(p);space.regions=space.regions.filter(r=>r!==region);return true;}
 use(space){this.current=space||null;}
 translate(address,op='r',mode='kernel'){if(mode==='kernel'){const a=Number(address)>>>0;if(a>=this.ram.size)throw new Error('Kernel address out of bounds');return a;}if(!this.current)throw new Error('No current address space');return this.current.pageTable.translate(address,op,mode);}
 read8(address,op='r',mode='kernel'){return this.ram.read8(this.translate(address,op,mode));}
 write8(address,value,mode='kernel'){this.ram.write8(this.translate(address,'w',mode),value);}
 read64(address,mode='kernel'){let v=0n;for(let i=0;i<8;i++)v|=BigInt(this.read8(Number(address)+i,'r',mode))<<(8n*BigInt(i));return v;}
 write64(address,value,mode='kernel'){value=BigInt.asUintN(64,BigInt(value));for(let i=0;i<8;i++)this.write8(Number(address)+i,Number((value>>(8n*BigInt(i)))&255n),mode);}
 stats(){return{physical:this.physical.stats(),spaces:this.spaces.size,currentPid:this.current?.pid??null,kernelMappings:this.kernel.entriesArray().length};}
}