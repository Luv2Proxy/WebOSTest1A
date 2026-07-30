export const MODES=Object.freeze({KERNEL:0,USER:1});
export class PrivilegeError extends Error{}
export function requireKernel(cpu){if(cpu.mode!==MODES.KERNEL)throw new PrivilegeError('Kernel privilege required');}
