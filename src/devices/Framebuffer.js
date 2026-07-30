import {Device} from './Device.js';
export class Framebuffer extends Device{
 constructor(width=320,height=240){super('framebuffer');this.width=width;this.height=height;this.pixels=new Uint8Array(width*height);}
 clear(){this.pixels.fill(0);}
 write(address,value){const i=address%(this.width*this.height);if(i>=0)this.pixels[i]=value&0xFF;}
}
