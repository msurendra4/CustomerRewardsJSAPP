
import { fetchTransactions } from './services/api.js';
import { renderMonthYearFilters, renderCustomerList, renderSummaryAndMonthly, renderTransactionsTable } from './ui/uiRenderer.js';
import { filterByYearMonth } from './modules/filters.js';
import { calculateMonthlyPoints } from './modules/rewardsCalculator.js';
import { YEARS } from './constants.js';
import { logger } from './utils/logger.js';

const state = {
  all: [],
  customers: [],
  selectedCustomer: null,
  customerPage: 1,
  txPage: 1,
  filter: { month:'last3', year: YEARS[0], defaultLast3: true },
  onSelectCustomer(id){ this.selectedCustomer = id; this.txPage=1; render(); },
  onCustomerPage(page){ this.customerPage = Math.max(1, page); render(); },
  onTxPage(page){ this.txPage = Math.max(1, page); render(false); }
};

function getAllForCustomer(id){
  return state.all.filter(t => t.customerId === id).sort((a,b)=> new Date(b.date)-new Date(a.date));
}

function currentTransactions(){
  const allForCustomer = getAllForCustomer(state.selectedCustomer);
  if (state.filter.month === 'last3') {
    const keys = new Set((function(){ const arr=[]; const now=new Date(); for(let i=0;i<3;i++){ const d=new Date(now.getFullYear(), now.getMonth()-i,1); arr.push(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`);} return arr; })());
    const { byMonthTx } = calculateMonthlyPoints(allForCustomer);
    return Object.entries(byMonthTx).filter(([k])=>keys.has(k)).flatMap(([,arr])=>arr).sort((a,b)=>new Date(b.date)-new Date(a.date));
  } else {
    return filterByYearMonth(allForCustomer, state.filter.year, state.filter.month).map(t=>({ ...t, points: undefined })).sort((a,b)=>new Date(b.date)-new Date(a.date));
  }
}

async function init(){
  try{
    renderMonthYearFilters();
    
    document.getElementById('monthDropdown').addEventListener('change',(e)=>{ state.filter.month = e.target.value; state.filter.defaultLast3 = e.target.value==='last3'; state.txPage=1; render(); });
    document.getElementById('yearDropdown').addEventListener('change',(e)=>{ state.filter.year = Number(e.target.value); state.txPage=1; render(); });

    state.all = await fetchTransactions();
    state.customers = [...new Set(state.all.map(t=>t.customerId))].sort();
    state.selectedCustomer = state.customers[0] || null;
    render();
  } catch (err) {
    logger.error('init failed', err);
    document.getElementById('customerList').innerHTML = '<p style="color:#900">Failed to load data</p>';
  }
}

function render(full=true){
  if (full) renderCustomerList(state.customers, state);
  const allForCustomer = getAllForCustomer(state.selectedCustomer);
  renderSummaryAndMonthly(allForCustomer, state.selectedCustomer, state.filter);
  const txs = currentTransactions();
  // compute points for txs
  const { byMonthTx } = calculateMonthlyPoints(allForCustomer);
  const txsWithPoints = txs.map(t => ({ ...t, points: (byMonthTx && Object.values(byMonthTx).flat().find(x=>x.transactionId===t.transactionId)?.points) || 0 }));
  renderTransactionsTable(txsWithPoints, state);
}

init();
