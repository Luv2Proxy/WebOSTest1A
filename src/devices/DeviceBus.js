export class DeviceBus {
  constructor(){this.devices=new Map();}
  map(start,end,device){this.devices.set(device,{start,end});}
  find(address){for(const [device,r] of this.devices)if(address>=r.start&&address<=r.end)return {device,offset:address-r.start};return null;}
  read8(address){const x=this.find(address);return x?.device.read(x.offset)??0;}
  write8(address,value){const x=this.find(address);x?.device.write(x.offset,value&255);}
}