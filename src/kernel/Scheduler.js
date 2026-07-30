export class Scheduler {constructor(quantum=2000){this.queue=[];this.current=null;this.quantum=quantum;this.remaining=quantum;this.totalTicks=0;}
 add(process){if(!this.queue.includes(process)&&process.state!=='terminated'&&process.state!=='crashed'){process.state='ready';this.queue.push(process);}}
 remove(process){this.queue=this.queue.filter(p=>p!==process);if(this.current===process)this.current=null;}
 next(){if(this.current&&this.current.state==='running'){this.current.stop();this.queue.push(this.current);}while(this.queue.length){const p=this.queue.shift();if(p.state==='ready'){p.start();this.current=p;this.remaining=this.quantum;return p;}}this.current=null;return null;}
 tick(){if(!this.current||this.current.state!=='running'||this.remaining<=0)return this.next();return this.current;}
 consume(n=1){this.remaining=Math.max(0,this.remaining-n);this.totalTicks+=n;return this.remaining===0;}
 snapshot(){return{current:this.current?.pid??null,queued:this.queue.map(p=>p.pid),remaining:this.remaining,quantum:this.quantum,totalTicks:this.totalTicks};}
}