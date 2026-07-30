export class KernelMemory {
 constructor(vmm,{base=0x800000,size=0x700000}={}){this.vmm=vmm;this.base=base;this.size=size;this.next=base;this.allocations=new Map();}
 align(n){return (Number(n)+this.vmm.pageSize-1)&~(this.vmm.pageSize-1);}
 alloc(size,permissions='rw'){const n=this.align(size);if(this.next+n>this.base+this.size)throw new Error('Kernel virtual memory exhausted');const physical=this.vmm.physical.allocMany(n/this.vmm.pageSize);for(let i=0;i<physical.length;i++)this.vmm.kernel.map(this.next+i*this.vmm.pageSize,physical[i],permissions,false);const address=this.next;this.next+=n;this.allocations.set(address,{size:n,physical,permissions});return address;}
 free(address){const a=this.allocations.get(address);if(!a)return false;for(let i=0;i<a.physical.length;i++){this.vmm.kernel.unmap(address+i*this.vmm.pageSize);this.vmm.physical.release(a.physical[i]);}this.allocations.delete(address);return true;}
}