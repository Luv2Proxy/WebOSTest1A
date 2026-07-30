import {PhysicalMemory} from './PhysicalMemory.js';import {PageTable} from './PageTable.js';
export class VirtualMemoryManager {
 constructor(ram,{pageSize=4096}={}){this.ram=ram;this.physical=new PhysicalMemory(ram.size,pageSize);this.pageSize=pageSize;this.kernel=new PageTable(pageSize);this.spaces=new Map();this.current=null;this.physical.reserve(0,0x1FFF);this.physical.reserve(0x800000,ram.size-1);}
 createSpace(pid){const s={pid,pageTable:new PageTable(this.pageSize),regions:[]};this.spaces.set(pid,s);return s;}
 map(space,virtual,size,permissions='rwx',user=true){const count=Math.ceil(size/this.pageSize),physical=this.physical.allocMany(count);for(let i=0;i<count;i++)space.pageTable.map(virtual+i*this.pageSize,physical[i],permissions,user);space.regions.push({virtual,size,permissions,user,physical});return space;}
 unmap(space,virtual,size){const count=Math.ceil(size/this.pageSize);const region=space.regions.find(r=>r.virtual===virtual&&r.size===size);for(let i=0;i<count;i++){const e=space.pageTable.get(virtual+i*this.pageSize);if(e)this.physical.release(e.physical);space.pageTable.unmap(virtual+i*this.pageSize);}if(region)space.regions=space.regions.filter(r=>r!==region);}
 use(space){this.current=space||null;}
 translate(address,op='r',mode='kernel'){if(mode==='kernel')return Number(address)>>>0;if(!this.current)throw new Error('No current address space');return this.current.pageTable.translate(address,op,mode);}
 read8(address,op='r',mode='kernel'){return this.ram.read8(this.translate(address,op,mode));}
 write8(address,value,mode='kernel'){this.ram.write8(this.translate(address,'w',mode),value);}
 read64(address,mode='kernel'){let v=0n;for(let i=0;i<8;i++)v|=BigInt(this.read8(Number(address)+i,'r',mode))<<(8n*BigInt(i));return v;}
 write64(address,value,mode='kernel'){value=BigInt.asUintN(64,BigInt(value));for(let i=0;i<8;i++)this.write8(Number(address)+i,Number((value>>(8n*BigInt(i)))&255n),mode);}
 stats(){return{physical:this.physical.stats(),spaces:this.spaces.size,currentPid:this.current?.pid??null};}
}