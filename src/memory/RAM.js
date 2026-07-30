export class RAM{
 constructor(size=0x10000){this.bytes=new Uint8Array(size);this.size=size;}
 clear(){this.bytes.fill(0);}
 read8(address){return this.bytes[address&0xFFFF];}
 write8(address,value){this.bytes[address&0xFFFF]=value&0xFF;}
 read16(address){return this.read8(address)|(this.read8(address+1)<<8);}
 write16(address,value){this.write8(address,value);this.write8(address+1,value>>8);}
 load(data,start=0x0100){this.bytes.set(data,start&0xFFFF);}
}
