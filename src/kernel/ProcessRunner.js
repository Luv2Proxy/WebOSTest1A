export class ProcessRunner {
  constructor(machine,processManager,scheduler){this.machine=machine;this.processManager=processManager;this.scheduler=scheduler;this.quantum=1000;}
  saveCPU(p){if(!p)return;p.registers.set(this.machine.cpu.reg);p.pc=this.machine.cpu.pc;p.sp=this.machine.cpu.sp;}
  loadCPU(p){this.machine.cpu.reg.set(p.registers);this.machine.cpu.pc=p.pc;this.machine.cpu.sp=p.sp;this.machine.cpu.halted=false;}
  runTick(){const previous=this.scheduler.current;if(previous)this.saveCPU(previous);const p=this.scheduler.next();if(!p)return null;this.loadCPU(p);let count=0;try{while(!this.machine.cpu.halted&&count++<this.quantum)this.machine.cpu.step();}catch(e){p.state='terminated';p.exitCode=1;p.error=e;return p;}this.saveCPU(p);if(this.machine.cpu.halted)p.state='terminated';else this.scheduler.add(p);return p;}
}