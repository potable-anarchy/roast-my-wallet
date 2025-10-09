/**
 * TypeScript types for wallet analysis and roasting functionality
 */

/**
 * Analyzed wallet data from blockchain transactions
 */
export interface WalletAnalysis {
  address: string;
  totalTransactions: number;
  totalGasSpent: string; // in ETH
  failedTransactions: number;
  firstTxDate: Date | null;
  lastTxDate: Date | null;
  uniqueDays: number;
  averageGasPrice: string;
}

/**
 * Generated roast card data
 */
export interface RoastCard {
  walletAddress: string;
  roastText: string;
  severity: "mild" | "medium" | "nuclear";
  stats: {
    gasWasted: string;
    failureRate: number;
    degenScore: number; // 0-100
    transactionCount: number;
  };
  timestamp: Date;
}

/**
 * Achievement badge earned by wallet
 */
export interface Badge {
  id: string;
  name: string;
  icon: string; // emoji
  description: string;
  rarity: "common" | "rare" | "legendary";
}

/**
 * Raw transaction data from Blockscout API
 */
export interface BlockscoutTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  gasPrice: string;
  isError: "0" | "1";
  timeStamp: string; // Unix timestamp as string
  blockNumber: string;
}

/**
 * Blockscout API response
 */
export interface BlockscoutApiResponse {
  status: string;
  message: string;
  result: BlockscoutTransaction[];
}
