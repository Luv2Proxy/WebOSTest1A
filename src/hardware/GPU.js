export class GPU {
  constructor(width=640,height=360){this.width=width;this.height=height;this.framebuffer=new Uint32Array(width*height);this.cursorX=0;this.cursorY=0;this.mode='text';this.clearColor=0x101820;}
  clear(color=this.clearColor){this.framebuffer.fill(color>>>0);}
  setMode(mode){if(mode!=='text'&&mode!=='graphics')throw new Error('Invalid GPU mode');this.mode=mode;}
  pixel(x,y,color){if(x<0||y<0||x>=this.width||y>=this.height)return;this.framebuffer[y*this.width+x]=color>>>0;}
  rect(x,y,w,h,color){const x0=Math.max(0,x|0),y0=Math.max(0,y|0),x1=Math.min(this.width,(x+w)|0),y1=Math.min(this.height,(y+h)|0);for(let yy=y0;yy<y1;yy++)for(let xx=x0;xx<x1;xx++)this.framebuffer[yy*this.width+xx]=color>>>0;}
  snapshot(){return {width:this.width,height:this.height,pixels:this.framebuffer.slice(),mode:this.mode};}
}