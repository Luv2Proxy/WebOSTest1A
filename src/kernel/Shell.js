export class Shell {
  constructor(kernel){this.kernel=kernel;this.cwd='/';this.commands={
    help:()=>Object.keys(this.commands).join('  '),
    pwd:()=>this.cwd,
    ls:args=>this.kernel.fs.list(this.resolve(args[0]||this.cwd)).then(items=>items.map(x=>x.name+(x.type==='dir'?'/':'')).join('\n')),
    cd:async args=>{const target=this.resolve(args[0]||'/');if(!(await this.kernel.fs.exists(target)))throw new Error('Directory not found: '+target);const items=await this.kernel.fs.list(target);if(target!=='/'&&this.kernel.fs.files.get(target)?.type!=='dir')throw new Error('Not a directory: '+target);this.cwd=target;return '';},
    cat:args=>this.kernel.fs.readFile(this.resolve(args[0])),
    mkdir:args=>this.kernel.fs.mkdir(this.resolve(args[0])),
    write:async args=>{const p=args.shift();if(!p)throw new Error('Usage: write <file> <text>');await this.kernel.fs.writeFile(this.resolve(p),args.join(' '));return '';},
    rm:args=>this.kernel.fs.remove(this.resolve(args[0])),
    ps:()=>this.kernel.processes.list().map(p=>`${p.pid}\t${p.state}\t${p.name}`).join('\n'),
    clear:()=>({clear:true})
  };}
  resolve(path){path=String(path||'');if(!path)return this.cwd;if(path.startsWith('/'))return this.normalize(path);return this.normalize(this.cwd+'/'+path);}
  normalize(path){const parts=[];for(const p of String(path).split('/')){if(!p||p==='.')continue;if(p==='..')parts.pop();else parts.push(p);}return '/'+parts.join('/');}
  async execute(line){const parts=line.trim().split(/\s+/);if(!parts[0])return '';const cmd=this.commands[parts[0]];if(!cmd)return `command not found: ${parts[0]}`;try{return await cmd(parts.slice(1));}catch(e){return `error: ${e.message}`;}}
}