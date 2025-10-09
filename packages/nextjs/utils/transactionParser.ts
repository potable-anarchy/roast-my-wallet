import type { Badge, BlockscoutTransaction, WalletAnalysis } from "../types/wallet";
import { formatEther } from "viem";

/**
 * Parse raw blockchain transactions into wallet analysis
 * @param transactions Array of transactions from Blockscout API
 * @returns Analyzed wallet data
 */
export function parseTransactions(transactions: BlockscoutTransaction[]): WalletAnalysis {
  if (!transactions || transactions.length === 0) {
    return {
      address: "",
      totalTransactions: 0,
      totalGasSpent: "0",
      failedTransactions: 0,
      firstTxDate: null,
      lastTxDate: null,
      uniqueDays: 0,
      averageGasPrice: "0",
    };
  }

  const address = transactions[0].from;
  const totalTransactions = transactions.length;

  // Calculate total gas spent
  let totalGasWei = 0n;
  let totalGasPriceSum = 0n;
  let failedTransactions = 0;

  const dates = new Set<string>();

  transactions.forEach(tx => {
    const gasUsed = BigInt(tx.gasUsed);
    const gasPrice = BigInt(tx.gasPrice);
    totalGasWei += gasUsed * gasPrice;
    totalGasPriceSum += gasPrice;

    if (tx.isError === "1") {
      failedTransactions++;
    }

    // Track unique days
    const date = new Date(parseInt(tx.timeStamp) * 1000);
    dates.add(date.toISOString().split("T")[0]);
  });

  const totalGasSpent = formatEther(totalGasWei);
  const averageGasPrice = formatEther(totalGasPriceSum / BigInt(totalTransactions));

  // Get first and last transaction dates
  const timestamps = transactions.map(tx => parseInt(tx.timeStamp) * 1000);
  const firstTxDate = new Date(Math.min(...timestamps));
  const lastTxDate = new Date(Math.max(...timestamps));

  return {
    address,
    totalTransactions,
    totalGasSpent,
    failedTransactions,
    firstTxDate,
    lastTxDate,
    uniqueDays: dates.size,
    averageGasPrice,
  };
}

/**
 * Calculate degen score based on wallet behavior
 * @param analysis Wallet analysis data
 * @returns Score from 0-100 (higher = more degen)
 */
export function calculateDegenScore(analysis: WalletAnalysis): number {
  let score = 0;

  // Failed transaction rate (0-30 points)
  if (analysis.totalTransactions > 0) {
    const failureRate = analysis.failedTransactions / analysis.totalTransactions;
    score += Math.min(failureRate * 150, 30); // Up to 30 points for 20%+ failure rate
  }

  // Total gas wasted (0-30 points)
  const gasSpent = parseFloat(analysis.totalGasSpent);
  if (gasSpent > 5) score += 30;
  else if (gasSpent > 2) score += 25;
  else if (gasSpent > 1) score += 20;
  else if (gasSpent > 0.5) score += 15;
  else if (gasSpent > 0.1) score += 10;
  else score += 5;

  // Transaction frequency (0-20 points)
  if (analysis.uniqueDays > 0) {
    const txPerDay = analysis.totalTransactions / analysis.uniqueDays;
    if (txPerDay > 20) score += 20;
    else if (txPerDay > 10) score += 15;
    else if (txPerDay > 5) score += 10;
    else score += 5;
  }

  // Account age (0-20 points) - newer accounts are more degen
  if (analysis.firstTxDate && analysis.lastTxDate) {
    const ageInDays = (analysis.lastTxDate.getTime() - analysis.firstTxDate.getTime()) / (1000 * 60 * 60 * 24);
    if (ageInDays < 7)
      score += 20; // Less than a week
    else if (ageInDays < 30)
      score += 15; // Less than a month
    else if (ageInDays < 90)
      score += 10; // Less than 3 months
    else if (ageInDays < 365)
      score += 5; // Less than a year
    else score += 2; // OG status
  }

  return Math.min(Math.round(score), 100);
}

/**
 * Generate achievement badges based on wallet behavior
 * @param analysis Wallet analysis data
 * @returns Array of earned badges
 */
export function generateBadges(analysis: WalletAnalysis): Badge[] {
  const badges: Badge[] = [];

  // Gas Burner badge
  const gasSpent = parseFloat(analysis.totalGasSpent);
  if (gasSpent > 5) {
    badges.push({
      id: "gas-burner-legendary",
      name: "Legendary Gas Burner",
      icon: "🔥",
      description: `Wasted over 5 ETH in gas fees`,
      rarity: "legendary",
    });
  } else if (gasSpent > 1) {
    badges.push({
      id: "gas-burner",
      name: "Gas Burner",
      icon: "🔥",
      description: `Wasted over 1 ETH in gas fees`,
      rarity: "rare",
    });
  } else if (gasSpent > 0.1) {
    badges.push({
      id: "gas-spender",
      name: "Gas Spender",
      icon: "💸",
      description: "Spent some ETH on gas",
      rarity: "common",
    });
  }

  // Paper Hands badge (high transaction frequency)
  if (analysis.uniqueDays > 0) {
    const txPerDay = analysis.totalTransactions / analysis.uniqueDays;
    if (txPerDay > 10) {
      badges.push({
        id: "paper-hands",
        name: "Paper Hands",
        icon: "📄",
        description: "Trading more than 10 times per day",
        rarity: "rare",
      });
    }
  }

  // OG badge (account older than 1 year)
  if (analysis.firstTxDate && analysis.lastTxDate) {
    const ageInDays = (analysis.lastTxDate.getTime() - analysis.firstTxDate.getTime()) / (1000 * 60 * 60 * 24);
    if (ageInDays > 365) {
      badges.push({
        id: "og",
        name: "OG",
        icon: "👴",
        description: "Account older than 1 year",
        rarity: "legendary",
      });
    }
  }

  // Smooth Brain badge (high failure rate)
  if (analysis.totalTransactions > 0) {
    const failureRate = analysis.failedTransactions / analysis.totalTransactions;
    if (failureRate > 0.2) {
      badges.push({
        id: "smooth-brain",
        name: "Smooth Brain",
        icon: "🧠",
        description: "More than 20% of transactions failed",
        rarity: "rare",
      });
    }
  }

  // Transaction Fiend badge
  if (analysis.totalTransactions > 1000) {
    badges.push({
      id: "tx-fiend",
      name: "Transaction Fiend",
      icon: "🤖",
      description: "Over 1000 transactions",
      rarity: "legendary",
    });
  } else if (analysis.totalTransactions > 100) {
    badges.push({
      id: "active-trader",
      name: "Active Trader",
      icon: "📊",
      description: "Over 100 transactions",
      rarity: "rare",
    });
  }

  // Newbie badge (very few transactions)
  if (analysis.totalTransactions < 10) {
    badges.push({
      id: "newbie",
      name: "Newbie",
      icon: "🐣",
      description: "Just getting started",
      rarity: "common",
    });
  }

  return badges;
}
