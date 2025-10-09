import type { BlockscoutApiResponse, BlockscoutTransaction } from "../types/wallet";

const BLOCKSCOUT_API_URL = "https://evm-testnet.flowscan.io/api";
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

interface CachedData {
  transactions: BlockscoutTransaction[];
  timestamp: number;
}

/**
 * Fetch transactions from Blockscout API
 * @param address Wallet address to fetch transactions for
 * @returns Array of transactions
 * @throws Error if API request fails
 */
export async function fetchTransactions(address: string): Promise<BlockscoutTransaction[]> {
  if (!address) {
    throw new Error("Address is required");
  }

  const url = `${BLOCKSCOUT_API_URL}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BlockscoutApiResponse = await response.json();

    if (data.status === "0") {
      // No transactions found or API error
      if (data.message === "No transactions found") {
        return [];
      }
      throw new Error(data.message || "API returned error status");
    }

    // Limit to last 100 transactions for MVP
    const transactions = data.result.slice(0, 100);

    return transactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to fetch transactions from Blockscout");
  }
}

/**
 * Get cached transactions from localStorage
 * @param address Wallet address
 * @returns Cached transactions or null if not found/expired
 */
export function getCachedTransactions(address: string): BlockscoutTransaction[] | null {
  if (typeof window === "undefined") return null;

  try {
    const cacheKey = `roast_tx_${address.toLowerCase()}`;
    const cached = localStorage.getItem(cacheKey);

    if (!cached) return null;

    const data: CachedData = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is still valid (less than 1 hour old)
    if (now - data.timestamp < CACHE_DURATION) {
      return data.transactions;
    }

    // Cache expired, remove it
    localStorage.removeItem(cacheKey);
    return null;
  } catch (error) {
    console.error("Error reading cache:", error);
    return null;
  }
}

/**
 * Store transactions in localStorage cache
 * @param address Wallet address
 * @param transactions Array of transactions to cache
 */
export function setCachedTransactions(address: string, transactions: BlockscoutTransaction[]): void {
  if (typeof window === "undefined") return;

  try {
    const cacheKey = `roast_tx_${address.toLowerCase()}`;
    const data: CachedData = {
      transactions,
      timestamp: Date.now(),
    };

    localStorage.setItem(cacheKey, JSON.stringify(data));
  } catch (error) {
    console.error("Error writing cache:", error);
    // Don't throw - caching is not critical
  }
}

/**
 * Get transactions with automatic caching
 * Checks cache first, then fetches from API if needed
 * @param address Wallet address
 * @returns Array of transactions
 */
export async function getTransactionsWithCache(address: string): Promise<BlockscoutTransaction[]> {
  // Try cache first
  const cached = getCachedTransactions(address);
  if (cached) {
    console.log("Using cached transactions for", address);
    return cached;
  }

  // Cache miss or expired - fetch from API
  console.log("Fetching fresh transactions for", address);
  const transactions = await fetchTransactions(address);

  // Cache the result
  setCachedTransactions(address, transactions);

  return transactions;
}
