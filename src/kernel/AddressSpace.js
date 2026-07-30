export class AddressSpace {constructor(pid){this.pid=pid;this.regions=[];this.stackTop=0x7FFF00;this.heapBase=0x200000;}
 map(start,end,permissions='rwx'){if(end<start)throw new Error('Invalid memory region');this.regions.push({start:Number(start)>>>0,end:Number(end)>>>0,permissions});return this;}
 unmap(start,end){this.regions=this.regions.filter(r=>r.end<start||r.start>end);return this;}
 contains(address,op='r'){address=Number(address)>>>0;const r=this.regions.find(x=>address>=x.start&&address<=x.end);return !!r&&r.permissions.includes(op);}
 validateRange(start,length,op='r'){if(length<0)throw new Error('Invalid range');if(length===0)return true;return this.contains(start,op)&&this.contains(Number(start)+length-1,op);}
 clone(){const a=new AddressSpace(this.pid);a.stackTop=this.stackTop;a.heapBase=this.heapBase;a.regions=this.regions.map(x=>({...x}));return a;}
}