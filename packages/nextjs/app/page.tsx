"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { LoadingRoast } from "~~/components/LoadingRoast";
import { RoastCard } from "~~/components/RoastCard";
import { ShareButtons } from "~~/components/ShareButtons";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useRoastGenerator } from "~~/hooks/useRoastGenerator";
import { useWalletAnalysis } from "~~/hooks/useWalletAnalysis";
import type { Badge, WalletAnalysis } from "~~/types/wallet";

// Demo data for testing without a real wallet
const DEMO_ADDRESS = "0x1234567890123456789012345678901234567890";
const DEMO_ANALYSIS: WalletAnalysis = {
  address: DEMO_ADDRESS,
  totalTransactions: 247,
  totalGasSpent: "2.847",
  failedTransactions: 34,
  firstTxDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 180 days ago
  lastTxDate: new Date(),
  uniqueDays: 87,
  averageGasPrice: "0.000000012",
};

const DEMO_DEGEN_SCORE = 73;

const DEMO_BADGES: Badge[] = [
  { id: "gas-burner", name: "Gas Burner", icon: "🔥", description: "Wasted over 1 ETH in gas", rarity: "rare" },
  {
    id: "paper-hands",
    name: "Paper Hands",
    icon: "📄",
    description: "Trading more than 10 times per day",
    rarity: "rare",
  },
  {
    id: "smooth-brain",
    name: "Smooth Brain",
    icon: "🧠",
    description: "More than 20% of transactions failed",
    rarity: "rare",
  },
];

const DEMO_ROAST = `You've speedrun through 247 transactions like you're allergic to keeping your FLOW. Burned 2.8 ETH in gas fees - that's not gas money, that's a down payment on regret. Failed 34 transactions because apparently reading error messages is optional. Your 13.7% failure rate screams "I ape first, ask questions never." But hey, you've been consistently wrong for 180 days straight. That's dedication to the craft of losing money. NGMI energy, but we respect the commitment to chaos.`;

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [showRoast, setShowRoast] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  // Fetch wallet analysis
  const {
    analysis,
    degenScore,
    badges,
    isLoading: isAnalyzing,
    error: analysisError,
  } = useWalletAnalysis(connectedAddress);

  // Roast generation
  const { roast, isGenerating, error: roastError, generateRoast, reset } = useRoastGenerator();

  // Handle roast button click
  const handleRoastClick = async () => {
    if (!analysis || !connectedAddress) return;

    setShowRoast(true);
    await generateRoast(analysis, connectedAddress);
  };

  // Handle demo mode
  const handleDemoClick = () => {
    setDemoMode(true);
    setShowRoast(true);
  };

  // Handle roast again
  const handleRoastAgain = () => {
    reset();
    setShowRoast(false);
    setDemoMode(false);
  };

  // Use demo data if in demo mode, otherwise use real data
  const displayAnalysis = demoMode ? DEMO_ANALYSIS : analysis;
  const displayDegenScore = demoMode ? DEMO_DEGEN_SCORE : degenScore;
  const displayBadges = demoMode ? DEMO_BADGES : badges;
  const displayRoast = demoMode ? DEMO_ROAST : roast;
  const displayAddress = demoMode ? DEMO_ADDRESS : connectedAddress;

  // Calculate failure rate for display
  const failureRate =
    displayAnalysis && displayAnalysis.totalTransactions > 0
      ? (displayAnalysis.failedTransactions / displayAnalysis.totalTransactions) * 100
      : 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-base-300 via-base-200 to-base-300">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            🔥 ROAST MY WALLET 🔥
          </h1>
          <p className="text-xl opacity-80 mb-6">Turn your cringe on-chain history into shareable entertainment</p>

          {/* Connect Button */}
          <div className="flex justify-center mb-6">
            <RainbowKitCustomConnectButton />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center gap-6">
          {/* Initial State - Not Connected */}
          {!connectedAddress && !demoMode && (
            <div className="card bg-base-200 shadow-xl p-8 text-center max-w-md">
              <p className="text-lg mb-4">Connect your wallet to see your on-chain trading history roasted by AI</p>
              <p className="text-sm opacity-60 mb-6">
                We&apos;ll analyze your transactions on Flow EVM and give you brutally honest feedback
              </p>

              {/* Demo Mode Button */}
              <div className="divider">OR</div>
              <button className="btn btn-secondary btn-outline gap-2" onClick={handleDemoClick}>
                <span>🎭</span>
                Try Demo Mode
              </button>
              <p className="text-xs opacity-50 mt-2">See how it works without connecting a wallet</p>
            </div>
          )}

          {/* Connected - Show Analysis Status */}
          {connectedAddress && !showRoast && (
            <div className="w-full max-w-2xl">
              {isAnalyzing ? (
                <div className="card bg-base-200 shadow-xl p-8">
                  <LoadingRoast />
                </div>
              ) : analysisError ? (
                <div className="alert alert-error">
                  <span>❌ {analysisError}</span>
                  <button className="btn btn-sm" onClick={() => window.location.reload()}>
                    Retry
                  </button>
                </div>
              ) : analysis ? (
                <div className="card bg-base-200 shadow-xl p-8 text-center">
                  <h2 className="text-2xl font-bold mb-4">Wallet Analyzed! 📊</h2>
                  <div className="stats stats-vertical md:stats-horizontal shadow mb-6">
                    <div className="stat">
                      <div className="stat-title">Transactions</div>
                      <div className="stat-value text-2xl">{analysis.totalTransactions}</div>
                    </div>
                    <div className="stat">
                      <div className="stat-title">Gas Wasted</div>
                      <div className="stat-value text-2xl">{parseFloat(analysis.totalGasSpent).toFixed(3)} ETH</div>
                    </div>
                    <div className="stat">
                      <div className="stat-title">Degen Score</div>
                      <div className="stat-value text-2xl">{degenScore}/100</div>
                    </div>
                  </div>
                  <button className="btn btn-primary btn-lg" onClick={handleRoastClick}>
                    🔥 ROAST MY WALLET 🔥
                  </button>
                </div>
              ) : null}
            </div>
          )}

          {/* Generating Roast */}
          {showRoast && isGenerating && !demoMode && (
            <div className="card bg-base-200 shadow-xl p-8 w-full max-w-2xl">
              <LoadingRoast />
            </div>
          )}

          {/* Display Roast */}
          {showRoast &&
            (demoMode || (!isGenerating && roast && analysis && connectedAddress && degenScore !== null)) && (
              <div className="flex flex-col gap-6 items-center w-full">
                {demoMode && (
                  <div className="alert alert-info mb-4">
                    <span>🎭</span>
                    <span>
                      Demo Mode - This is example data. Connect a real wallet to roast your actual transactions!
                    </span>
                  </div>
                )}
                <RoastCard
                  walletAddress={displayAddress || "0x0000"}
                  roastText={displayRoast || ""}
                  degenScore={displayDegenScore || 0}
                  stats={{
                    gasWasted: displayAnalysis?.totalGasSpent || "0",
                    failureRate: failureRate,
                    transactionCount: displayAnalysis?.totalTransactions || 0,
                  }}
                  badges={displayBadges}
                  onRoastAgain={handleRoastAgain}
                />
                <ShareButtons degenScore={displayDegenScore || 0} />
              </div>
            )}

          {/* Roast Error */}
          {showRoast && !isGenerating && roastError && !demoMode && (
            <div className="alert alert-error max-w-2xl">
              <span>❌ {roastError}</span>
              <button className="btn btn-sm" onClick={handleRoastClick}>
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 opacity-60">
          <p className="text-sm">Built with Scaffold-ETH 2 × Flow EVM × Gemini AI</p>
          <p className="text-xs mt-2">For entertainment purposes only. Your wallet&apos;s secrets are safe with us.</p>
          {demoMode && <p className="text-xs mt-2 text-accent font-semibold">🎭 Currently in Demo Mode</p>}
        </div>
      </div>
    </div>
  );
};

export default Home;
