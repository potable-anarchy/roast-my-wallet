import { NextResponse } from "next/server";
import type { WalletAnalysis } from "../../../types/wallet";

// Rate limiting - simple in-memory cache
const rateLimits = new Map<string, number[]>();

/**
 * Check if address has exceeded rate limit
 * @param address Wallet address
 * @returns true if within rate limit, false if exceeded
 */
function checkRateLimit(address: string): boolean {
  const now = Date.now();
  const userRequests = rateLimits.get(address.toLowerCase()) || [];
  const recentRequests = userRequests.filter(time => now - time < 60000); // Last minute

  if (recentRequests.length >= 3) {
    return false; // Rate limit exceeded
  }

  rateLimits.set(address.toLowerCase(), [...recentRequests, now]);
  return true;
}

/**
 * Build prompt for Claude AI
 * @param data Wallet analysis data
 * @returns Formatted prompt string
 */
function buildRoastPrompt(data: WalletAnalysis): string {
  const failureRate =
    data.totalTransactions > 0 ? ((data.failedTransactions / data.totalTransactions) * 100).toFixed(1) : "0";

  return `You're a savage crypto trader roasting someone's wallet history. Be brutal but funny.

Wallet Stats:
- Total transactions: ${data.totalTransactions}
- Gas wasted: ${data.totalGasSpent} ETH
- Failed transactions: ${data.failedTransactions} (${failureRate}% failure rate)
- Active days: ${data.uniqueDays}
- Account age: ${data.firstTxDate ? Math.floor((Date.now() - data.firstTxDate.getTime()) / (1000 * 60 * 60 * 24)) : "unknown"} days

Write a 80-100 word roast that's:
- Brutally honest but funny
- Focuses on their worst decisions
- Uses crypto slang (NGMI, rekt, ape, degen, etc.)
- Ends with unexpected motivation or sarcastic encouragement
- No asterisks. No emojis. Just pure text.

Be creative and savage. Make it memorable!`;
}

/**
 * Generate fallback roast when API fails
 * @param data Wallet analysis data
 * @returns Template roast string
 */
function generateFallbackRoast(data: WalletAnalysis): string {
  const gasSpent = parseFloat(data.totalGasSpent).toFixed(2);
  const failureRate =
    data.totalTransactions > 0 ? ((data.failedTransactions / data.totalTransactions) * 100).toFixed(0) : "0";

  const roasts = [
    `You've made ${data.totalTransactions} transactions and wasted ${gasSpent} ETH in gas. That's not very cash money of you. With a ${failureRate}% failure rate, you're basically speedrunning losses. But hey, at least you're consistent at being wrong. NGMI vibes, but we believe in your comeback arc... maybe.`,

    `Wasted ${gasSpent} ETH on gas fees across ${data.totalTransactions} transactions. Sir, this is not a casino, but you're treating it like one. Failed ${data.failedTransactions} times - that's dedication to losing money. Your wallet is the financial equivalent of a dumpster fire, but at least it's YOUR dumpster fire. Keep grinding, degen.`,

    `${data.totalTransactions} transactions and you still haven't figured it out. Burned through ${gasSpent} ETH in gas like it's Monopoly money. With ${data.failedTransactions} failed transactions, you're basically allergic to success. But you know what? The market needs exit liquidity, and you're providing a valuable service. WAGMI... just not you.`,
  ];

  return roasts[Math.floor(Math.random() * roasts.length)];
}

/**
 * Call Google Gemini API to generate roast
 */
async function callGeminiAPI(prompt: string): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 500,
        },
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates[0]?.content?.parts[0]?.text || "";
}

/**
 * POST handler for generating roasts
 */
export async function POST(req: Request) {
  try {
    const { walletData, address } = await req.json();

    if (!walletData || !address) {
      return NextResponse.json({ error: "Missing required data: walletData and address" }, { status: 400 });
    }

    // Rate limiting check
    if (!checkRateLimit(address)) {
      return NextResponse.json({ error: "Rate limit exceeded. Wait a minute and try again." }, { status: 429 });
    }

    // Check for API key
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY not set, using fallback roast");
      const fallbackRoast = generateFallbackRoast(walletData);
      return NextResponse.json({ roast: fallbackRoast });
    }

    // Call Gemini API
    const prompt = buildRoastPrompt(walletData);
    const roastText = await callGeminiAPI(prompt);

    if (!roastText) {
      throw new Error("No roast text returned from Gemini");
    }

    return NextResponse.json({ roast: roastText });
  } catch (error) {
    console.error("Roast generation failed:", error);

    // Return fallback roast on error
    try {
      const body = await req.json();
      const fallbackRoast = body.walletData
        ? generateFallbackRoast(body.walletData)
        : "Your wallet is so bad, even the AI refused to roast it. That's impressive in the worst way possible.";
      return NextResponse.json({ roast: fallbackRoast });
    } catch {
      return NextResponse.json({
        roast: "Your wallet is so bad, even the AI refused to roast it. That's impressive in the worst way possible.",
      });
    }
  }
}
