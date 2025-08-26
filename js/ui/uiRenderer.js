
import { MONTHS, YEARS, CUSTOMER_PAGE_SIZE, TX_PAGE_SIZE } from '../constants.js';
import { calculateMonthlyPoints } from '../modules/rewardsCalculator.js';

/** Render month/year dropdowns */
export function renderMonthYearFilters() {
  const monthSel = document.getElementById('monthDropdown');
  const yearSel = document.getElementById('yearDropdown');
  monthSel.innerHTML = `<option value="last3">Last 3 Months</option>` + MONTHS.map((m,i)=>`<option value="${i+1}">${m}</option>`).join('');
  yearSel.innerHTML = YEARS.map(y=>`<option value="${y}">${y}</option>`).join('');
  yearSel.value = YEARS[0];
  monthSel.value = 'last3';
}

/** Render customer list (paginated) */
export function renderCustomerList(customers, state){
  const start=(state.customerPage-1)*CUSTOMER_PAGE_SIZE;
  const pageItems = customers.slice(start, start+CUSTOMER_PAGE_SIZE);
  const container = document.getElementById('customerList');
  container.innerHTML = pageItems.map(id=>`<div class="customer-card ${state.selectedCustomer===id?'active':''}" data-id="${id}"><div>${id}</div><div class="tag">View</div></div>`).join('');
  container.querySelectorAll('.customer-card').forEach(el=> el.addEventListener('click', ()=> state.onSelectCustomer(el.dataset.id)));
  const totalPages = Math.max(1, Math.ceil(customers.length / CUSTOMER_PAGE_SIZE));
  document.getElementById('customerPagination').innerHTML = `<button ${state.customerPage===1?'disabled':''} id="custPrev">Prev</button><span class="page-info">Page ${state.customerPage}/${totalPages}</span><button ${state.customerPage===totalPages?'disabled':''} id="custNext">Next</button>`;
  document.getElementById('custPrev')?.addEventListener('click', ()=> state.onCustomerPage(state.customerPage-1));
  document.getElementById('custNext')?.addEventListener('click', ()=> state.onCustomerPage(state.customerPage+1));
}

/** Render summary and monthly breakdown */
export function renderSummaryAndMonthly(allForCustomer, selectedCustomer, filter){
  const { monthlyPoints, totalPoints } = calculateMonthlyPoints(allForCustomer || []);
  // document.getElementById('summary').innerHTML = `<h2>${selectedCustomer? selectedCustomer + 'Rewards'}</h2><p>Total Points: <strong>${totalPoints}</strong></p>`;
  const last3 = new Set((filter.defaultLast3? (function(){ const arr=[]; const now=new Date(); for(let i=0;i<3;i++){ const d=new Date(now.getFullYear(), now.getMonth()-i,1); arr.push(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`);} return arr; })():[]));
  const entries = Object.entries(monthlyPoints).filter(([k]) => filter.defaultLast3 ? last3.has(k) : true).sort((a,b)=>b[0]-a[0]);
  if (!entries.length) { document.getElementById('monthlyBreakdown').innerHTML = '<p>No transactions</p>'; return; }
  document.getElementById('monthlyBreakdown').innerHTML = `<table><thead><tr><th>Month</th><th>Points</th></tr></thead><tbody>${entries.map(([k,v])=>{ const [y,m]=k.split('-'); return `<tr><td>${MONTHS[Number(m)-1]} ${y}</td><td>${v}</td></tr>` }).join('')}</tbody></table>`;
}

/** Render transactions table with pagination */
export function renderTransactionsTable(txs, state){
  const tableWrap = document.getElementById('transactionsTable');
  if (!txs || txs.length===0){ tableWrap.innerHTML=''; document.getElementById('transactionsPagination').innerHTML=''; document.getElementById('transactionsHeading').textContent='Transactions'; return; }
  const start = (state.txPage-1)*TX_PAGE_SIZE;
  const pageItems = txs.slice(start, start+TX_PAGE_SIZE);
  tableWrap.innerHTML = `<table><thead><tr><th>Transaction ID</th><th>Date</th><th>Amount</th><th>Points</th></tr></thead><tbody>${pageItems.map(t=>`<tr><td>${t.transactionId}</td><td>${t.date}</td><td>$${Number(t.amount).toFixed(2)}</td><td>${t.points ?? 0}</td></tr>`).join('')}</tbody></table><p class="transactions-note">Showing ${pageItems.length} of ${txs.length} transactions</p>`;
  const totalPages = Math.max(1, Math.ceil(txs.length / TX_PAGE_SIZE));
  document.getElementById('transactionsPagination').innerHTML = `<button ${state.txPage===1?'disabled':''} id="txPrev">Prev</button><span class="page-info">Page ${state.txPage}/${totalPages}</span><button ${state.txPage===totalPages?'disabled':''} id="txNext">Next</button>`;
  document.getElementById('txPrev')?.addEventListener('click', ()=> state.onTxPage(state.txPage-1));
  document.getElementById('txNext')?.addEventListener('click', ()=> state.onTxPage(state.txPage+1));
}
