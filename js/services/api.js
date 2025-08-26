
import { API } from '../constants.js';
import { logger } from '../utils/logger.js';

/**
 * Simulate async fetch from local JSON file
 * @returns {Promise<Array>}
 */
export async function fetchTransactions() {
  logger.info('fetchTransactions: start');
  await new Promise(r => setTimeout(r, API.LATENCY_MS));
  if (API.ERROR_RATE > 0 && Math.random() < API.ERROR_RATE) {
    logger.error('Simulated API error');
    throw new Error('Simulated network error');
  }
  const res = await fetch(API.URL, {cache:'no-store'});
  if (!res.ok) {
    logger.error('HTTP error', res.status);
    throw new Error('HTTP ' + res.status);
  }
  const data = await res.json();
  logger.info('fetchTransactions: success', data.length, 'records');
  return data;
}

async function fetchData() {
    try {
        const response = await fetch("./public/data/transactions.json");
        if (!response.ok) throw new Error("Failed to load transactions data");

        const data = await response.json();
        console.log("Data loaded:", data);

        populateCustomerDropdown(data); // ✅ ensure dropdown is populated
        
    } catch (error) {
        console.error("Error loading data:", error);
        alert("Error loading customer transactions data.");
    }
}

