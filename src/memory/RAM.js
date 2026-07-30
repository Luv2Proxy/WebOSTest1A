export class RAM{
 constructor(size=0x1000000){this.size=size>>>0;this.bytes=new Uint8Array(this.size);}
 clear(){this.bytes.fill(0);}
 check(address){address=Number(address)>>>0;if(address>=this.size)throw new Error('RAM access out of bounds: 0x'+address.toString(16));return address;}
 read8(address){return this.bytes[this.check(address)];}
 write8(address,value){this.bytes[this.check(address)]=Number(value)&255;}
 read16(address){return this.read8(address)|(this.read8(address+1)<<8);}
 write16(address,value){this.write8(address,value);this.write8(address+1,value>>8);}
 read32(address){return (this.read16(address)|(this.read16(address+2)<<16))>>>0;}
 write32(address,value){this.write16(address,value);this.write16(address+2,value>>>16);}
 read64(address){let v=0n;for(let i=0;i<8;i++)v|=BigInt(this.read8(address+i))<<(8n*BigInt(i));return v;}
 write64(address,value){value=BigInt.asUintN(64,BigInt(value));for(let i=0;i<8;i++)this.write8(address+i,Number((value>>BigInt(i*8))&255n));}
 load(data,start=0x1000){if(start+data.length>this.size)throw new Error('Program does not fit in RAM');this.bytes.set(data,start);}
}