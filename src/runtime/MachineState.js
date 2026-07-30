export class MachineState {
  constructor(machine){this.machine=machine;}
  save(){const c=this.machine.cpu;return {registers:Array.from(c.reg),pc:c.pc,sp:c.sp,flags:{...c.flags},cycles:c.cycles,ram:Array.from(this.machine.ram.bytes)};}
  load(s){const c=this.machine.cpu;c.reg.set(s.registers);c.pc=s.pc;c.sp=s.sp;c.flags={...s.flags};c.cycles=s.cycles;this.machine.ram.bytes.set(s.ram);}
}