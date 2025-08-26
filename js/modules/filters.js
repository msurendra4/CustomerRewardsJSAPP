
import { MONTHS } from '../constants.js';
/** Return last N months metadata (key,label) */
export function lastNMonths(n, now = new Date()){
  const out=[];
  const base = new Date(now.getFullYear(), now.getMonth(), 1);
  for (let i=0;i<n;i++){
    const d = new Date(base.getFullYear(), base.getMonth()-i, 1);
    out.push({ key: `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`, label: `${MONTHS[d.getMonth()]} ${d.getFullYear()}`, y: d.getFullYear(), m: d.getMonth()+1 });
  }
  return out;
}

export function filterByYearMonth(txs, year, month){
  return txs.filter(t=> { const d=new Date(t.date); return d.getFullYear()===Number(year) && (d.getMonth()+1)===Number(month); });
}
