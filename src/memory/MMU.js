import {MEMORY_MAP} from './memoryMap.js';
export class MMU {
 constructor(ram,devices={}){this.ram=ram;this.devices=devices;this.pageSize=4096;this.pages=new Map();}
 map(start,end,permissions='rwx',owner='kernel'){for(let p=start&~4095;p<=end;p+=this.pageSize)this.pages.set(p>>12,{permissions,owner});}
 unmap(start,end){for(let p=start&~4095;p<=end;p+=this.pageSize)this.pages.delete(p>>12);}
 check(a,op='r',mode='kernel'){a=Number(a)>>>0;const page=this.pages.get(a>>>12);if(mode==='kernel')return true;if(!page)throw new Error('Page fault at 0x'+a.toString(16));if(!page.permissions.includes(op))throw new Error('Protection fault at 0x'+a.toString(16));return true;}
 translate(a,op='r',mode='kernel'){a=Number(a)>>>0;this.check(a,op,mode);return a;}
 read8(a,mode='kernel'){a=this.translate(a,'r',mode);if(a===MEMORY_MAP.TERMINAL_IN)return this.devices.terminal?.read()??0;if(a===MEMORY_MAP.TIMER)return this.devices.timer?.read()??0;if(a>=MEMORY_MAP.FRAMEBUFFER_BASE&&a<MEMORY_MAP.FRAMEBUFFER_BASE+MEMORY_MAP.FRAMEBUFFER_WIDTH*MEMORY_MAP.FRAMEBUFFER_HEIGHT)return this.devices.framebuffer?.read(a-MEMORY_MAP.FRAMEBUFFER_BASE)??0;return this.ram.read8(a);}
 write8(a,v,mode='kernel'){a=this.translate(a,'w',mode);v&=255;if(a===MEMORY_MAP.TERMINAL_OUT){this.devices.terminal?.write(v);return;}if(a===MEMORY_MAP.TIMER){this.devices.timer?.write(v);return;}if(a>=MEMORY_MAP.FRAMEBUFFER_BASE&&a<MEMORY_MAP.FRAMEBUFFER_BASE+MEMORY_MAP.FRAMEBUFFER_WIDTH*MEMORY_MAP.FRAMEBUFFER_HEIGHT){this.devices.framebuffer?.write(a-MEMORY_MAP.FRAMEBUFFER_BASE,v);return;}this.ram.write8(a,v);}
 read16(a,mode='kernel'){return this.read8(a,mode)|this.read8(a+1,mode)<<8;}
 write16(a,v,mode='kernel'){this.write8(a,v,mode);this.write8(a+1,v>>8,mode);}
 read32(a,mode='kernel'){return (this.read16(a,mode)|(this.read16(a+2,mode)<<16))>>>0;}
 write32(a,v,mode='kernel'){this.write16(a,v,mode);this.write16(a+2,v>>>16,mode);}
 read64(a,mode='kernel'){let v=0n;for(let i=0;i<8;i++)v|=BigInt(this.read8(Number(a)+i,mode))<<(8n*BigInt(i));return v;}
 write64(a,v,mode='kernel'){v=BigInt.asUintN(64,BigInt(v));for(let i=0;i<8;i++)this.write8(Number(a)+i,Number((v>>(8n*BigInt(i)))&255n),mode);}
}