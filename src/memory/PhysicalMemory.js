export class PhysicalMemory {
 constructor(size=0x1000000,pageSize=4096){this.size=size>>>0;this.pageSize=pageSize;this.pages=new Uint8Array(Math.ceil(this.size/this.pageSize));this.free=new Uint8Array(this.pages.length);this.free.fill(1);this.reserved=new Set();}
 reserve(start,end){for(let p=start&~(this.pageSize-1);p<=end;p+=this.pageSize){const i=p/this.pageSize;if(i<this.free.length){this.free[i]=0;this.reserved.add(i);}}}
 alloc(){for(let i=0;i<this.free.length;i++)if(this.free[i]){this.free[i]=0;return i*this.pageSize;}throw new Error('Out of physical memory');}
 allocMany(count){const out=[];try{for(let i=0;i<count;i++)out.push(this.alloc());return out;}catch(e){for(const p of out)this.release(p);throw e;}}
 release(address){const i=(Number(address)>>>0)/this.pageSize;if(this.reserved.has(i))return false;if(i>=0&&i<this.free.length){this.free[i]=1;return true;}return false;}
 freeCount(){let n=0;for(const v of this.free)n+=v;return n;}
 stats(){return{totalPages:this.free.length,freePages:this.freeCount(),usedPages:this.free.length-this.freeCount(),pageSize:this.pageSize};}
}