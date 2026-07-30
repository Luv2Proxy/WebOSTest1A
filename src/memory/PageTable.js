export class PageTable {
 constructor(pageSize=4096){this.pageSize=pageSize;this.entries=new Map();}
 key(virtual){return (Number(virtual)>>>0)/this.pageSize|0;}
 map(virtual,physical,permissions='rwx',user=true){this.entries.set(this.key(virtual),{virtual:virtual&~(this.pageSize-1),physical:physical&~(this.pageSize-1),permissions,user,present:true});return this;}
 unmap(virtual){this.entries.delete(this.key(virtual));}
 get(virtual){return this.entries.get(this.key(virtual));}
 translate(virtual,op='r',mode='user'){const v=Number(virtual)>>>0,e=this.get(v);if(!e||!e.present)throw new Error('Page fault: unmapped 0x'+v.toString(16));if(mode==='user'&&!e.user)throw new Error('Privilege fault: kernel page');if(!e.permissions.includes(op))throw new Error('Protection fault: '+op+' 0x'+v.toString(16));return (e.physical+(v%this.pageSize))>>>0;}
 clone(){const p=new PageTable(this.pageSize);for(const [k,v] of this.entries)p.entries.set(k,{...v});return p;}
 entriesArray(){return [...this.entries.values()];}
}