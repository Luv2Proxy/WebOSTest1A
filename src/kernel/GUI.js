export class KernelGUI {
  constructor(kernel,gpu){this.kernel=kernel;this.gpu=gpu;this.windows=[];this.active=null;this.mouse={x:0,y:0,buttons:0};}
  createWindow(title,x=40,y=40,w=300,h=180){const win={id:crypto.randomUUID(),title,x,y,w,h,visible:true};this.windows.push(win);this.active=win.id;return win;}
  closeWindow(id){this.windows=this.windows.filter(w=>w.id!==id);if(this.active===id)this.active=this.windows.at(-1)?.id||null;}
  focus(id){if(this.windows.some(w=>w.id===id))this.active=id;}
  render(){this.gpu.setMode('graphics');this.gpu.clear(0x172033);this.gpu.rect(0,this.gpu.height-44,this.gpu.width,44,0x101722);for(const w of this.windows.filter(w=>w.visible)){const active=w.id===this.active;this.gpu.rect(w.x,w.y,w.w,w.h,0xf0f4f8);this.gpu.rect(w.x,w.y,w.w,32,active?0x1769aa:0x43546a);this.gpu.rect(w.x+w.w-34,w.y+6,22,20,0xd9534f);}}
  snapshot(){return {windows:this.windows.map(w=>({...w})),active:this.active};}
}