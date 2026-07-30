export class VirtualTerminalUI {
  constructor(system,root){this.system=system;this.root=root;this.output=root.querySelector('.terminal-output');this.input=root.querySelector('.terminal-input');this.prompt=root.querySelector('.terminal-prompt');this.input.addEventListener('keydown',e=>{if(e.key==='Enter'){const line=this.input.value;this.input.value='';this.write('\nvcpu16> '+line+'\n');this.execute(line);}});}
  write(text){this.output.textContent+=String(text);this.output.scrollTop=this.output.scrollHeight;}
  execute(line){if(!line.trim())return;Promise.resolve(this.system.executeCommand(line)).then(result=>{if(result)this.write(String(result)+'\n');this.write('vcpu16> ');});}
  focus(){this.input.focus();}
  clear(){this.output.textContent='';}
}