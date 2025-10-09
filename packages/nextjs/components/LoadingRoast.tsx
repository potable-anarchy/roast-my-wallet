"use client";

import { useEffect, useState } from "react";

const LOADING_MESSAGES = [
  "Analyzing your poor life choices...",
  "Counting failed transactions...",
  "Calculating gas wasted...",
  "Finding your worst trades...",
  "Preparing the roast...",
  "This might hurt a little...",
  "Generating brutal honesty...",
  "Consulting the blockchain gods...",
  "Double-checking your losses...",
];

/**
 * Fun loading animation while roast is being generated
 */
export function LoadingRoast() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8">
      {/* Animated spinner */}
      <div className="relative">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl animate-pulse">🔥</span>
        </div>
      </div>

      {/* Rotating message */}
      <div className="text-center min-h-[60px] flex items-center">
        <p className="text-xl font-medium animate-fade-in max-w-md">{LOADING_MESSAGES[messageIndex]}</p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
