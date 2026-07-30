export class VirtualFS {
 constructor(storage=null){this.storage=storage;this.files=new Map();this.ready=this._init();}
 normalize(p){p='/'+String(p||'').split('/').filter(Boolean).join('/');return p==='/'?'/':p;}
 async _init(){if(!this.storage)return;const entries=await this.storage.list();this.files=new Map(entries.map(x=>[x.path,{type:x.type,data:x.data}]));if(!this.files.has('/')){this.files.set('/',{type:'dir'});await this.storage.put('/','', 'dir');}}
 async ensureReady(){await this.ready;}
 async mkdir(p){await this.ensureReady();p=this.normalize(p);if(!this.files.has(p)){this.files.set(p,{type:'dir'});await this.storage?.put(p,'','dir');}}
 async writeFile(p,data){await this.ensureReady();p=this.normalize(p);const parent=p.slice(0,p.lastIndexOf('/'))||'/';await this.mkdir(parent);this.files.set(p,{type:'file',data:String(data)});await this.storage?.put(p,String(data),'file');}
 async readFile(p){await this.ensureReady();const f=this.files.get(this.normalize(p));if(!f||f.type!=='file')throw new Error('File not found: '+p);return f.data;}
 async exists(p){await this.ensureReady();return this.files.has(this.normalize(p));}
 async list(p='/'){await this.ensureReady();p=this.normalize(p);const prefix=p==='/'?'/':p+'/';const out=[];for(const [name,f] of this.files)if(name!==p&&name.startsWith(prefix)&&!name.slice(prefix.length).includes('/'))out.push({name:name.slice(prefix.length),type:f.type});return out;}
 async remove(p){await this.ensureReady();p=this.normalize(p);this.files.delete(p);await this.storage?.remove(p);}
 snapshot(){return [...this.files.entries()];}
 async restore(entries){this.files=new Map(entries);for(const [p,f] of this.files)await this.storage?.put(p,f.data||'',f.type);}
}