import {assemble} from '../assembler/Assembler.js';
export class Loader {
  constructor(machine,fs){this.machine=machine;this.fs=fs;}
  loadAssembly(source){return assemble(source).bytes;}
  loadFile(path){return this.loadAssembly(this.fs.readFile(path));}
  install(path,source){this.fs.writeFile(path,source);}
  bootFile(path){const image=this.loadFile(path);this.machine.load(image);return image;}
}