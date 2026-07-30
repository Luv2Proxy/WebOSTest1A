export const REGISTER_COUNT=8;
export const REGISTER_NAMES=Array.from({length:REGISTER_COUNT},(_,i)=>`R${i}`);
export function registerIndex(name){const m=/^R([0-7])$/i.exec(name.trim());if(!m)throw new Error(`Invalid register: ${name}`);return Number(m[1]);}
