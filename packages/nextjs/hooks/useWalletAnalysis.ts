import { useCallback, useEffect, useState } from "react";
import type { Badge, WalletAnalysis } from "../types/wallet";
import { getTransactionsWithCache } from "../utils/blockscoutApi";
import { calculateDegenScore, generateBadges, parseTransactions } from "../utils/transactionParser";

/**
 * Custom hook to fetch and analyze wallet transactions
 * @param address Wallet address to analyze
 * @returns Analysis data, loading state, error, and refetch function
 */
export function useWalletAnalysis(address: string | undefined) {
  const [analysis, setAnalysis] = useState<WalletAnalysis | null>(null);
  const [degenScore, setDegenScore] = useState<number | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAndAnalyze = useCallback(async (addr: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate address format (basic check)
      if (!addr.startsWith("0x") || addr.length !== 42) {
        throw new Error("Invalid address format");
      }

      // Fetch transactions
      const transactions = await getTransactionsWithCache(addr);

      if (!transactions || transactions.length === 0) {
        setError("No transactions found for this wallet");
        setAnalysis(null);
        setDegenScore(null);
        setBadges([]);
        return;
      }

      // Parse and analyze
      const walletAnalysis = parseTransactions(transactions);
      const score = calculateDegenScore(walletAnalysis);
      const earnedBadges = generateBadges(walletAnalysis);

      setAnalysis(walletAnalysis);
      setDegenScore(score);
      setBadges(earnedBadges);
    } catch (err) {
      console.error("Error analyzing wallet:", err);
      setError(err instanceof Error ? err.message : "Failed to analyze wallet");
      setAnalysis(null);
      setDegenScore(null);
      setBadges([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on address change
  useEffect(() => {
    if (address) {
      fetchAndAnalyze(address);
    } else {
      // Clear data when address is undefined
      setAnalysis(null);
      setDegenScore(null);
      setBadges([]);
      setError(null);
    }
  }, [address, fetchAndAnalyze]);

  const refetch = useCallback(() => {
    if (address) {
      fetchAndAnalyze(address);
    }
  }, [address, fetchAndAnalyze]);

  return {
    analysis,
    degenScore,
    badges,
    isLoading,
    error,
    refetch,
  };
}
