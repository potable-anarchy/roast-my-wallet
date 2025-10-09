"use client";

import React from "react";
import type { Badge } from "../types/wallet";
import { Address } from "~~/components/scaffold-eth";

interface RoastCardProps {
  walletAddress: string;
  roastText: string;
  degenScore: number;
  stats: {
    gasWasted: string;
    failureRate: number;
    transactionCount: number;
  };
  badges: Badge[];
  onShare?: () => void;
  onDownload?: () => void;
  onRoastAgain?: () => void;
}

/**
 * Display a wallet roast in a shareable card format
 */
export function RoastCard({
  walletAddress,
  roastText,
  degenScore,
  stats,
  badges,
  onShare,
  onDownload,
  onRoastAgain,
}: RoastCardProps) {
  return (
    <div
      id="roast-card"
      className="card w-full max-w-2xl bg-gradient-to-br from-base-300 to-base-200 shadow-2xl border-2 border-accent"
    >
      <div className="card-body p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            🔥 ROAST MY WALLET 🔥
          </h1>
        </div>

        {/* Address */}
        <div className="flex justify-center mb-6">
          <div className="badge badge-lg badge-outline">
            <Address address={walletAddress} format="short" />
          </div>
        </div>

        {/* Roast Text */}
        <div className="bg-base-200 rounded-lg p-6 mb-6 border border-base-300">
          <p className="text-lg leading-relaxed text-center font-medium">{roastText}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="stat bg-base-300 rounded-lg p-4 text-center">
            <div className="stat-title text-xs">Gas Wasted</div>
            <div className="stat-value text-lg">💸</div>
            <div className="stat-desc font-semibold">{parseFloat(stats.gasWasted).toFixed(3)} ETH</div>
          </div>

          <div className="stat bg-base-300 rounded-lg p-4 text-center">
            <div className="stat-title text-xs">Failure Rate</div>
            <div className="stat-value text-lg">📉</div>
            <div className="stat-desc font-semibold">{stats.failureRate.toFixed(1)}%</div>
          </div>

          <div className="stat bg-base-300 rounded-lg p-4 text-center">
            <div className="stat-title text-xs">Transactions</div>
            <div className="stat-value text-lg">📊</div>
            <div className="stat-desc font-semibold">{stats.transactionCount}</div>
          </div>

          <div className="stat bg-base-300 rounded-lg p-4 text-center">
            <div className="stat-title text-xs">Degen Score</div>
            <div className="stat-value text-lg">🤡</div>
            <div className="stat-desc font-semibold">{degenScore}/100</div>
          </div>
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3 text-center opacity-70">BADGES EARNED</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {badges.map(badge => (
                <div
                  key={badge.id}
                  className={`badge badge-lg gap-2 ${
                    badge.rarity === "legendary"
                      ? "badge-primary"
                      : badge.rarity === "rare"
                        ? "badge-secondary"
                        : "badge-accent"
                  }`}
                  title={badge.description}
                >
                  <span>{badge.icon}</span>
                  <span className="text-xs">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="card-actions justify-center gap-3 flex-wrap">
          {onShare && (
            <button className="btn btn-primary btn-sm" onClick={onShare}>
              🐦 Share
            </button>
          )}
          {onDownload && (
            <button className="btn btn-secondary btn-sm" onClick={onDownload}>
              📥 Download
            </button>
          )}
          {onRoastAgain && (
            <button className="btn btn-accent btn-sm" onClick={onRoastAgain}>
              🔄 Roast Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
