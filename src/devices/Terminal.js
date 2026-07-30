import {Device} from './Device.js';
export class Terminal extends Device{
 constructor(onOutput=()=>{}){super('terminal');this.onOutput=onOutput;this.input=[];}
 write(value){this.onOutput(String.fromCharCode(value&0xFF));}
 read(){return this.input.length?this.input.shift():0;}
 pushInput(text){for(const c of text)this.input.push(c.charCodeAt(0));}
}
