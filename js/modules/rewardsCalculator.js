
/**
 * Calculate reward points for a transaction amount.
 * Rules:
 *  - 2 points for every dollar spent over $100
 *  - 1 point for every dollar spent between $50 and $100
 * @param {number} amount
 * @returns {number} points (integer)
 */
export function calculatePoints(amount){
  const a = Number(amount) || 0;
  if (a <= 50) return 0;
  if (a <= 100) return Math.floor(a - 50);
  return 50 + Math.floor((a - 100) * 2);
}

/**
 * Group transactions by YYYY-MM and compute monthly totals and per-tx points
 * @param {Array} transactions
 * @returns {Object} { monthlyPoints: {}, totalPoints: number, byMonthTx: {} }
 */
export function calculateMonthlyPoints(transactions = []){
  const monthlyPoints = {};
  const byMonthTx = {};
  let totalPoints = 0;
  for (const tx of transactions){
    if (!tx || !tx.date) continue;
    const d = new Date(tx.date);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    const pts = calculatePoints(tx.amount);
    totalPoints += pts;
    monthlyPoints[key] = (monthlyPoints[key] || 0) + pts;
    (byMonthTx[key] = byMonthTx[key] || []).push({ ...tx, points: pts });
  }
  return { monthlyPoints, totalPoints, byMonthTx };
}
