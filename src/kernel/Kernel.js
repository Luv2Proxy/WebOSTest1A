import {VirtualFS} from './VirtualFS.js';import {ProcessManager} from './ProcessManager.js';import {Scheduler} from './Scheduler.js';import {SyscallAPI} from './Syscalls.js';import {initializeFilesystem} from './FilesystemLayout.js';import {AddressSpace} from './AddressSpace.js';
export class Kernel {constructor(machine,fs=null){this.machine=machine;this.fs=fs||new VirtualFS();this.processes=new ProcessManager();this.scheduler=new Scheduler();this.current=null;this.syscalls=new SyscallAPI(this);this.gui=null;this.booted=false;}
 async boot(){await this.fs.ensureReady();initializeFilesystem(this.fs);await this.fs.ready;await this.fs.writeFile('/proc/version','VCPU-64 kernel 0.3');await this.fs.writeFile('/proc/arch','VCPU-64');this.booted=true;return this.fs.readFile('/etc/motd');}
 write(text){for(const c of String(text))this.machine.terminal.write(c.charCodeAt(0));return String(text).length;}
 read(){return this.machine.terminal.read();}
 spawn(entry=0x1000,name='process'){const p=this.processes.create(entry,name,this.machine.cpu);p.addressSpace=new AddressSpace(p.pid);p.addressSpace.map(0x1000,0x7FFFFF,'rwx');p.addressSpace.map(0x800000,0xFFFF00,'rw');this.scheduler.add(p);return p.pid;}
 exit(code=0){if(this.current)this.processes.kill(this.current.pid,code);return code;}
 schedule(){this.current=this.scheduler.next();if(this.current?.cpu){this.current.attachCPU(this.current.cpu);}return this.current;}
 tick(cycles=2000){if(!this.booted)return;let p=this.current;if(!p||p.state!=='running')p=this.schedule();if(!p)return;try{p.cpu.run(cycles);p.saveCPU();if(p.cpu.halted&&p.state==='running')this.processes.kill(p.pid,0);}catch(e){this.processes.crash(p.pid,e);}if(this.scheduler.consume(cycles))this.schedule();}
}