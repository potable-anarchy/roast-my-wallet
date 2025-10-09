import { useCallback, useState } from "react";
import type { WalletAnalysis } from "../types/wallet";

/**
 * Custom hook to generate AI roasts
 * @returns Roast text, loading state, error, and generate function
 */
export function useRoastGenerator() {
  const [roast, setRoast] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Generate a roast for the given wallet analysis
   * @param analysis Wallet analysis data
   * @param address Wallet address
   */
  const generateRoast = useCallback(async (analysis: WalletAnalysis, address: string) => {
    if (!analysis || !address) {
      setError("No wallet data to roast");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setRoast(null);

    try {
      const response = await fetch("/api/roast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletData: analysis,
          address: address,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Wait a minute and try again.");
        }
        throw new Error(`Failed to generate roast: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.roast) {
        throw new Error("No roast returned from API");
      }

      setRoast(data.roast);
    } catch (err) {
      console.error("Error generating roast:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to generate roast. Please try again.";
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  /**
   * Reset the roast state
   */
  const reset = useCallback(() => {
    setRoast(null);
    setError(null);
    // Don't reset isGenerating - let it finish naturally
  }, []);

  return {
    roast,
    isGenerating,
    error,
    generateRoast,
    reset,
  };
}
