export class VirtualFS {
 constructor(storage=null){this.storage=storage;this.files=new Map();this.ready=this._init();}
 normalize(p){const parts=[];for(const part of String(p||'').split('/')){if(!part||part==='.')continue;if(part==='..')parts.pop();else parts.push(part);}return '/'+parts.join('/');}
 async _init(){if(this.storage){const entries=await this.storage.list();this.files=new Map(entries.map(x=>[x.path,{type:x.type,data:x.data}]));}if(!this.files.has('/')){this.files.set('/',{type:'dir'});await this.storage?.put('/','','dir');}}
 async ensureReady(){await this.ready;}
 async mkdir(p){await this.ensureReady();p=this.normalize(p);if(this.files.has(p)){if(this.files.get(p).type!=='dir')throw new Error('File exists: '+p);return;}const parent=p.slice(0,p.lastIndexOf('/'))||'/';if(parent!==p)await this.mkdir(parent);this.files.set(p,{type:'dir'});await this.storage?.put(p,'','dir');}
 async writeFile(p,data){await this.ensureReady();p=this.normalize(p);const parent=p.slice(0,p.lastIndexOf('/'))||'/';await this.mkdir(parent);this.files.set(p,{type:'file',data:String(data)});await this.storage?.put(p,String(data),'file');}
 async readFile(p){await this.ensureReady();const f=this.files.get(this.normalize(p));if(!f||f.type!=='file')throw new Error('File not found: '+p);return f.data;}
 async exists(p){await this.ensureReady();return this.files.has(this.normalize(p));}
 async isDirectory(p){await this.ensureReady();const f=this.files.get(this.normalize(p));return !!f&&f.type==='dir';}
 async list(p='/'){await this.ensureReady();p=this.normalize(p);const dir=this.files.get(p);if(!dir||dir.type!=='dir')throw new Error('Not a directory: '+p);const prefix=p==='/'?'/':p+'/';const out=[];for(const [name,f] of this.files)if(name!==p&&name.startsWith(prefix)&&!name.slice(prefix.length).includes('/'))out.push({name:name.slice(prefix.length),type:f.type});return out.sort((a,b)=>a.type.localeCompare(b.type)||a.name.localeCompare(b.name));}
 async remove(p){await this.ensureReady();p=this.normalize(p);if(p==='/')throw new Error('Cannot remove root');const f=this.files.get(p);if(!f)throw new Error('Not found: '+p);const prefix=p+'/';for(const name of [...this.files.keys()])if(name===p||name.startsWith(prefix)){this.files.delete(name);await this.storage?.remove(name);}}
 snapshot(){return [...this.files.entries()];}
 async restore(entries){this.files=new Map(entries);for(const [p,f] of this.files)await this.storage?.put(p,f.data||'',f.type);}
}