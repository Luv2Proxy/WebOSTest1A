import {MEMORY_MAP} from './memoryMap.js';
export class MMU {
  constructor(ram, devices={}) { this.ram=ram; this.devices=devices; }
  read8(a){a&=0xFFFF;if(a===MEMORY_MAP.TERMINAL_IN)return this.devices.terminal?.read()??0;if(a===MEMORY_MAP.TIMER)return this.devices.timer?.read()??0;return this.ram.read8(a);}
  write8(a,v){a&=0xFFFF;v&=255;if(a===MEMORY_MAP.TERMINAL_OUT){this.devices.terminal?.write(v);return;}if(a===MEMORY_MAP.TIMER){this.devices.timer?.write(v);return;}if(a>=MEMORY_MAP.FRAMEBUFFER_BASE&&a<MEMORY_MAP.FRAMEBUFFER_BASE+MEMORY_MAP.FRAMEBUFFER_WIDTH*MEMORY_MAP.FRAMEBUFFER_HEIGHT){this.ram.write8(a,v);this.devices.framebuffer?.write(a-MEMORY_MAP.FRAMEBUFFER_BASE,v);return;}this.ram.write8(a,v);}
  read16(a){return this.read8(a)|this.read8(a+1)<<8;} write16(a,v){this.write8(a,v);this.write8(a+1,v>>8);}
}