export type RankRecord = {names: string[]; order: number[]; previous: {name: string; rank: number}[]; round: number};
export function emptyRecord(count: number): RankRecord { return {names:Array.from({length:count},(_,i)=>`플레이어 ${i+1}`),order:[],previous:[],round:1}; }
export function validRecord(value: unknown, count: number): value is RankRecord {
  if (!value || typeof value !== "object") return false;
  const r = value as RankRecord;
  return Array.isArray(r.names) && r.names.length===count && r.names.every(n=>typeof n==="string"&&n.length<=30) && Array.isArray(r.order) && r.order.length<=count && new Set(r.order).size===r.order.length && r.order.every(id=>Number.isInteger(id)&&id>=0&&id<count) && Number.isSafeInteger(r.round)&&r.round>=1 && Array.isArray(r.previous) && (r.previous.length===0 || r.previous.length===count) && r.previous.every((row,i)=>row&&typeof row.name==="string"&&row.name.length<=30&&row.rank===i+1);
}
export function finishPlayer(record: RankRecord, id: number): RankRecord {
  if (!Number.isInteger(id)||id<0||id>=record.names.length||record.order.includes(id)) return record;
  return {...record,order:[...record.order,id]};
}
export function moveRank(record: RankRecord, index: number, offset: number): RankRecord {
  const target=index+offset;
  if(index<0||index>=record.order.length||target<0||target>=record.order.length)return record;
  const order=[...record.order];[order[index],order[target]]=[order[target],order[index]];return {...record,order};
}
