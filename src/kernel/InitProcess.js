export class InitProcess {
 constructor(system){this.system=system;this.started=false;}
 async start(){if(this.started)return;this.started=true;await this.system.kernel.fs.writeFile('/proc/1/cmdline','init');await this.system.kernel.fs.writeFile('/proc/1/status','running');}
 async command(line){const result=await this.system.executeCommand(line);if(result&&result.clear){const out=this.system.terminal?.onOutput;out?.('\x1b[CLEAR]');return result;}return result;}
}

// Boot helper used by Kernel.boot(). Creates the first user process from
// the filesystem image. The init program is intentionally kept in the
// virtual filesystem so it can be edited and replaced like other programs.
export async function launchInit(kernel){
 const path='/sys/kernel/init.asm';
 if(!await kernel.fs.exists(path))throw new Error(`init executable not found: ${path}`);
 const process=await kernel.spawnAssembly(path,'init');
 process.parentPid=0;
 return process;
}