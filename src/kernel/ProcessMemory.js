export class ProcessMemory {
 constructor(vmm,process){this.vmm=vmm;this.process=process;this.space=vmm.createSpace(process.pid);process.addressSpace=this.space;process.pageTable=this.space.pageTable;}
 map(virtual,size,permissions='rwx',user=true){return this.vmm.map(this.space,virtual,size,permissions,user);}
 unmap(virtual,size){return this.vmm.unmap(this.space,virtual,size);}
 load(bytes,virtual=0x1000){const data=bytes instanceof Uint8Array?bytes:new Uint8Array(bytes);const start=virtual&~4095;const end=(virtual+data.length+4095)&~4095;const existing=this.space.regions.find(r=>r.virtual<=start&&r.virtual+r.size>=end);if(!existing)this.map(start,end-start,'rw-',true);for(let i=0;i<data.length;i++){const physical=this.vmm.translate(virtual+i,'w','user');this.vmm.ram.write8(physical,data[i]);}return data.length;}
 read8(address){return this.vmm.read8(address,'r','user');}write8(address,value){this.vmm.write8(address,value,'user');}
 read64(address){return this.vmm.read64(address,'user');}write64(address,value){this.vmm.write64(address,value,'user');}
}