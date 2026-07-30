export class Process {constructor(pid,entry,name='process'){this.pid=pid;this.entry=entry;this.name=name;this.state='ready';this.registers=Array.from({length:16},()=>0n);this.pc=entry;this.sp=0x7FFF00;this.flags=0;this.exitCode=0;this.cpu=null;this.addressSpace=null;this.pageTable=null;this.image=null;this.kernelStackTop=0x7FFFF0;this.userStackTop=0x7FFF00;this.createdAt=Date.now();this.error=null;this.fault=null;this.parentPid=0;this.children=new Set();this.startedAt=0;this.cpuTime=0;}
 attachCPU(cpu){this.cpu=cpu;cpu.currentPid=this.pid;cpu.pc=this.pc;cpu.sp=this.sp;cpu.reg=this.registers;cpu.flags=this.flags;cpu.halted=false;cpu.mode=1;}
 saveCPU(){if(!this.cpu)return;this.pc=this.cpu.pc;this.sp=this.cpu.sp;this.flags=this.cpu.flags??this.flags;this.registers=this.cpu.reg;this.cpuTime+=this.cpu.cycles||0;}
 start(){if(this.state==='ready'){this.state='running';this.startedAt=Date.now();}}
 stop(){if(this.state==='running')this.state='ready';}
}