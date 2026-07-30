export class InitProcess {
  constructor(system){this.system=system;this.started=false;}
  async start(){if(this.started)return;this.started=true;await this.system.kernel.fs.writeFile('/proc/1/cmdline','init');await this.system.kernel.fs.writeFile('/proc/1/status','running');}
  async command(line){const result=await this.system.executeCommand(line);if(result&&result.clear){const out=this.system.terminal?.onOutput;out?.('\x1b[CLEAR]');return result;}return result;}
}