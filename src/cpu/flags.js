export const FLAG_BITS=Object.freeze({Z:1<<0,N:1<<1,C:1<<2,V:1<<3});
export function createFlags(){return {Z:false,N:false,C:false,V:false};}
export function flagsToByte(flags){return (flags.Z?FLAG_BITS.Z:0)|(flags.N?FLAG_BITS.N:0)|(flags.C?FLAG_BITS.C:0)|(flags.V?FLAG_BITS.V:0);}
