"use client";

import { useState } from "react";
import html2canvas from "html2canvas";

interface ShareButtonsProps {
  degenScore: number;
  onDownload?: () => void;
}

/**
 * Component with share and download functionality for roast cards
 */
export function ShareButtons({ degenScore, onDownload }: ShareButtonsProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  /**
   * Download the roast card as an image
   */
  const downloadCard = async () => {
    setIsDownloading(true);
    setDownloadSuccess(false);

    try {
      const element = document.getElementById("roast-card");
      if (!element) {
        throw new Error("Roast card element not found");
      }

      const canvas = await html2canvas(element, {
        backgroundColor: "#000",
        scale: 2,
        logging: false,
      });

      // Convert to blob
      canvas.toBlob(blob => {
        if (!blob) {
          throw new Error("Failed to create image blob");
        }

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = "roast-my-wallet.png";
        link.href = url;
        link.click();

        // Cleanup
        URL.revokeObjectURL(url);

        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);

        if (onDownload) {
          onDownload();
        }
      });
    } catch (error) {
      console.error("Error downloading card:", error);
      alert("Failed to download image. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  /**
   * Share to Twitter
   */
  const shareToTwitter = () => {
    const tweetText = `I got roasted for my on-chain history 🔥

Degen Score: ${degenScore}/100

Get roasted: roastmywallet.xyz

#RoastMyWallet #FlowBlockchain`;

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center w-full">
      {/* Download Button */}
      <button
        className={`btn ${downloadSuccess ? "btn-success" : "btn-secondary"} gap-2`}
        onClick={downloadCard}
        disabled={isDownloading}
      >
        {isDownloading ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Downloading...
          </>
        ) : downloadSuccess ? (
          <>
            <span>✅</span>
            Downloaded!
          </>
        ) : (
          <>
            <span>📥</span>
            Download Image
          </>
        )}
      </button>

      {/* Twitter Share Button */}
      <button className="btn btn-primary gap-2" onClick={shareToTwitter}>
        <span>🐦</span>
        Share on Twitter
      </button>
    </div>
  );
}
