import {Process} from './Process.js';
export class ProcessManager {constructor(){this.nextPid=1;this.processes=new Map();}
 create(entry=0x1000,name='process',cpu=null){const p=new Process(this.nextPid++,entry,name);if(cpu)p.attachCPU(cpu);this.processes.set(p.pid,p);return p;}
 get(pid){return this.processes.get(pid);}
 kill(pid,code=0){const p=this.get(pid);if(!p)return false;p.saveCPU();p.state='terminated';p.exitCode=code;if(p.cpu)p.cpu.halted=true;return true;}
 crash(pid,error){const p=this.get(pid);if(!p)return false;p.saveCPU();p.state='crashed';p.error=error;if(p.cpu)p.cpu.halted=true;return true;}
 list(){return [...this.processes.values()];}
 reap(){for(const [pid,p] of this.processes)if(p.state==='terminated'||p.state==='crashed')this.processes.delete(pid);}
}