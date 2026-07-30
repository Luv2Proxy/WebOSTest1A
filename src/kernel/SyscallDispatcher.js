export class SyscallDispatcher {
 constructor(kernel){this.kernel=kernel;this.handlers=new Map();}
 register(number,handler){this.handlers.set(Number(number),handler);}
 dispatch(number,cpu){const handler=this.handlers.get(Number(number));if(!handler)throw new Error('Unknown syscall '+number);return handler(cpu);}
 installDefaults(){const k=this.kernel;this.register(0,cpu=>0);this.register(1,cpu=>{k.machine.terminal.write(Number(cpu.reg[0]&255n));return 0;});this.register(2,cpu=>{cpu.reg[0]=BigInt(k.machine.terminal.read()??0);return cpu.reg[0];});this.register(3,cpu=>k.exit(Number(cpu.reg[0]??0n)));this.register(4,cpu=>{cpu.reg[0]=BigInt(k.processes.list().filter(p=>p.state!=='terminated').length);return cpu.reg[0];});this.register(5,cpu=>{k.exit(0);return 0;});this.register(6,cpu=>{const p=k.current;cpu.reg[0]=BigInt(p?.pid??0);return cpu.reg[0];});this.register(7,cpu=>{cpu.reg[0]=BigInt(k.vmm.physical.freeCount());return cpu.reg[0];});return this;}
 call(number,cpu){return this.dispatch(number,cpu);}
}