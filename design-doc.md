# Roast My Wallet - Design Document

## Overview

A viral Web3 app that uses AI to roast users based on their on-chain transaction history. Users connect their wallet, get brutally honest feedback about their trading decisions, and share their roast card on social media.

**Target:** Forte Hacks by Flow ($250k prizes)  
**Timeline:** 8-10 hour build at hackathon (realistically)  
**Viral Hook:** Self-deprecating humor + shareable content + social proof

---

## Product Vision

### Core Value Prop
Turn your cringe on-chain history into shareable entertainment. Every bad trade becomes a viral moment.

### User Flow
```
1. Land on page → See example roasts
2. Click "Roast My Wallet"
3. Connect wallet (MetaMask/WalletConnect)
4. Loading animation (3-5 seconds)
5. Reveal roast card with animation
6. Share to Twitter/download image
7. Browse leaderboard of worst wallets
```

---

## Technical Architecture

### Stack

**Frontend**
- Next.js 14 (App Router)
- Scaffold-ETH 2 base template
- TailwindCSS for styling
- Wagmi v2 for wallet connections
- Viem for blockchain interactions
- html2canvas for card image generation

**Blockchain**
- Flow EVM (EVM-compatible L1)
  - Chain ID: 747 (mainnet) or 545 (testnet)
  - RPC: https://mainnet.evm.nodes.onflow.org
  - Testnet RPC: https://testnet.evm.nodes.onflow.org
- Blockscout API for transaction data
- No smart contracts needed (read-only)

**AI**
- Anthropic Claude API (server-side only)
- Model: claude-3-5-sonnet-20241022 (latest stable)
- API Key: Store in `.env.local` as `ANTHROPIC_API_KEY`
- Fallback: Pre-written template roasts if API fails
- Rate limit: 50 requests/min on free tier

**Hosting**
- Vercel (deploy from Scaffold-ETH)
- Edge functions for API routes

### Architecture Diagram

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ├─── Wallet Connect (wagmi)
       │    └─── Flow EVM RPC
       │
       ├─── Transaction Fetcher
       │    └─── Blockscout API
       │         └─── Parse transactions
       │
       ├─── AI Roaster (API route)
       │    └─── Claude API
       │         └─── Generate roast
       │
       └─── Card Generator
            └─── html2canvas
                 └─── Share/Download
```

---

## Data Models

### Transaction Data
```typescript
interface WalletAnalysis {
  address: string;
  totalTransactions: number;
  totalGasSpent: string; // in ETH
  failedTransactions: number;
  firstTxDate: Date;
  lastTxDate: Date;
  tokens: TokenActivity[];
  nfts: NFTActivity[];
  worstTrade: Trade;
  bestTrade: Trade;
  tradingPatterns: Pattern[];
}

interface TokenActivity {
  symbol: string;
  buyCount: number;
  sellCount: number;
  averageBuyPrice: number;
  averageSellPrice: number;
  totalProfit: number; // negative if loss
  holdingTime: number; // in days
}

interface Trade {
  token: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: Date;
  profitLoss: number;
}

interface Pattern {
  type: 'FOMO' | 'PAPER_HANDS' | 'GAS_WASTER' | 'NFT_DEGEN';
  confidence: number;
  evidence: string[];
}
```

### Roast Response
```typescript
interface RoastCard {
  walletAddress: string;
  roastText: string;
  severity: 'mild' | 'medium' | 'nuclear';
  stats: {
    gasWasted: string;
    worstTrade: string;
    failureRate: number;
    degenScore: number; // 0-100
  };
  badges: Badge[];
  timestamp: Date;
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}
```

---

## Features

### MVP (Must Have)
- [ ] Wallet connection (Flow EVM)
- [ ] Transaction fetching (last 100 txs)
- [ ] Basic analysis (gas, fails, tokens)
- [ ] AI roast generation
- [ ] Roast card display
- [ ] Twitter share button
- [ ] Download as image

### Nice to Have
- [ ] Roast severity slider
- [ ] Multiple roast styles (comedian, finance bro, therapist)
- [ ] Leaderboard (worst wallets)
- [ ] Badge system
- [ ] "Roast a friend" mode
- [ ] Historical roasts (save to localStorage)
- [ ] Comparison mode (roast 2 wallets)

### Future Ideas
- [ ] Mint roast as NFT
- [ ] Roast battles (compare 2 wallets)
- [ ] AI-generated memes based on trades
- [ ] Weekly "Worst Trade" newsletter
- [ ] Integration with DeBank/Zapper APIs

---

## Implementation Plan

### Phase 1: Setup (45-60 min)
```bash
# Clone Scaffold-ETH
git clone https://github.com/scaffold-eth/scaffold-eth-2 roast-my-wallet
cd roast-my-wallet
yarn install

# Configure for Flow EVM
# Update hardhat.config.ts with Flow network
# Update scaffold.config.ts
```

**Files to create/modify:**

`packages/nextjs/utils/customChains.ts` - Define Flow EVM chain
```typescript
import { defineChain } from "viem";

export const flowMainnet = defineChain({
  id: 747,
  name: "Flow EVM Mainnet",
  nativeCurrency: { name: "Flow", symbol: "FLOW", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://mainnet.evm.nodes.onflow.org"] },
  },
  blockExplorers: {
    default: { name: "Flowscan", url: "https://evm.flowscan.io" },
  },
});

export const flowTestnet = defineChain({
  id: 545,
  name: "Flow EVM Testnet",
  nativeCurrency: { name: "Flow", symbol: "FLOW", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet.evm.nodes.onflow.org"] },
  },
  blockExplorers: {
    default: { name: "Flowscan", url: "https://evm-testnet.flowscan.io" },
  },
  testnet: true,
});
```

`packages/nextjs/scaffold.config.ts` - Update target networks
```typescript
import { flowTestnet } from "./utils/customChains";

const scaffoldConfig = {
  targetNetworks: [flowTestnet],
  // ... rest of config
} as const satisfies ScaffoldConfig;
```

**Note:** No need to modify hardhat config since we're not deploying contracts.

### Phase 2: Wallet & Data (1.5-2 hours)

**Create `/packages/nextjs/hooks/useWalletAnalysis.ts`**
```typescript
export const useWalletAnalysis = (address: string) => {
  // Fetch transactions from Blockscout
  // Parse and analyze data
  // Return WalletAnalysis object
};
```

**Create `/packages/nextjs/utils/transactionParser.ts`**
```typescript
export function parseTransactions(txs: any[]): WalletAnalysis {
  // Extract gas spent
  // Identify token swaps
  // Find failed transactions
  // Calculate trading patterns
}
```

**API Integration:**
- Flow Blockscout: `https://evm.flowscan.io/api`
- Endpoints:
  - `?module=account&action=txlist&address={address}&startblock=0&endblock=99999999&sort=desc`
  - `?module=account&action=tokentx&address={address}`
- Consider caching results (1 hour TTL) to avoid rate limits
- Handle pagination if wallet has >10,000 transactions

**Environment Variables Required:**
```bash
# .env.local
ANTHROPIC_API_KEY=your_key_here
NEXT_PUBLIC_FLOW_RPC_URL=https://testnet.evm.nodes.onflow.org
```

### Phase 3: AI Roasting (1.5-2 hours)

**Create `/packages/nextjs/app/api/roast/route.ts`**
```typescript
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// Rate limiting - simple in-memory cache
const rateLimits = new Map<string, number[]>();

function checkRateLimit(address: string): boolean {
  const now = Date.now();
  const userRequests = rateLimits.get(address) || [];
  const recentRequests = userRequests.filter(time => now - time < 60000);
  
  if (recentRequests.length >= 3) return false;
  
  rateLimits.set(address, [...recentRequests, now]);
  return true;
}

export async function POST(req: Request) {
  try {
    const { walletData, address } = await req.json();
    
    // Rate limiting
    if (!checkRateLimit(address)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again in a minute." },
        { status: 429 }
      );
    }
    
    // Initialize Claude client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    
    // Call Claude API
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 500,
      messages: [{
        role: "user",
        content: buildRoastPrompt(walletData)
      }]
    });
    
    const roastText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';
    
    return NextResponse.json({ roast: roastText });
    
  } catch (error) {
    console.error("Roast generation failed:", error);
    
    // Fallback to template roast
    const fallbackRoast = generateFallbackRoast(walletData);
    return NextResponse.json({ roast: fallbackRoast });
  }
}

function generateFallbackRoast(data: any): string {
  return `You've made ${data.totalTransactions} transactions and wasted ${data.totalGasSpent} ETH in gas. That's not very cash money of you. Your worst trade lost ${data.worstTrade?.profitLoss || 'unknown'}, but hey, at least you're consistent at being wrong. NGMI vibes, but we believe in your comeback arc.`;
}
```

**Prompt Engineering:**
```typescript
function buildRoastPrompt(data: WalletAnalysis): string {
  return `You're a savage crypto trader roasting someone's wallet history.

Wallet Stats:
- Total transactions: ${data.totalTransactions}
- Gas wasted: ${data.totalGasSpent} ETH
- Failed transactions: ${data.failedTransactions}
- Worst trade: Lost ${data.worstTrade.profitLoss} on ${data.worstTrade.token}
- Trading patterns: ${data.tradingPatterns.map(p => p.type).join(', ')}

Write a 80-100 word roast that's:
- Brutally honest but funny
- Focuses on their worst decisions
- Uses crypto slang (NGMI, rekt, ape, etc.)
- Ends with unexpected motivation

No asterisks. No emojis. Just pure text.`;
}
```

### Phase 4: UI/UX (2-3 hours)

**Main Page: `/packages/nextjs/app/page.tsx`**
```
┌─────────────────────────────────────┐
│      🔥 ROAST MY WALLET 🔥         │
│                                     │
│  [See your trading mistakes in     │
│   brutal honesty]                  │
│                                     │
│    ┌──────────────────┐           │
│    │ Connect Wallet   │           │
│    └──────────────────┘           │
│                                     │
│  Example Roasts:                   │
│  ┌─────────────────────────┐      │
│  │ 0x1234...  "You spent   │      │
│  │ more on gas than..."    │      │
│  └─────────────────────────┘      │
└─────────────────────────────────────┘
```

**Roast Card Component: `/packages/nextjs/components/RoastCard.tsx`**
```
┌─────────────────────────────────────┐
│  🔥 ROAST MY WALLET 🔥             │
│                                     │
│  0x1234...5678                     │
│                                     │
│  ┌───────────────────────────────┐ │
│  │                               │ │
│  │   [AI ROAST TEXT HERE]        │ │
│  │   80-100 words of pure        │ │
│  │   savagery about your         │ │
│  │   trading decisions           │ │
│  │                               │ │
│  └───────────────────────────────┘ │
│                                     │
│  💸 Gas Wasted: 2.4 ETH            │
│  📉 Worst Trade: -$5,200           │
│  ❌ Failed Txs: 23                 │
│  🤡 Degen Score: 87/100            │
│                                     │
│  [Share] [Download] [Roast Again]  │
└─────────────────────────────────────┘
```

**Components to build:**
- `ConnectButton.tsx` - Wallet connection
- `LoadingRoast.tsx` - Fun loading animation
- `RoastCard.tsx` - Main card display
- `ShareButtons.tsx` - Twitter/download
- `Leaderboard.tsx` - Top roasted wallets

### Phase 5: Virality Features (1-2 hours)

**Twitter Share:**
```typescript
function generateTweet(roast: RoastCard): string {
  return `I got roasted for my on-chain history 🔥

Degen Score: ${roast.stats.degenScore}/100

Get roasted: https://roastmywallet.xyz

#RoastMyWallet #FlowBlockchain #ForteHacks`;
}
```

**Card Image Generation:**
```typescript
import html2canvas from 'html2canvas';

async function downloadCard(elementId: string) {
  const element = document.getElementById(elementId);
  const canvas = await html2canvas(element, {
    backgroundColor: '#000',
    scale: 2
  });
  
  const link = document.createElement('a');
  link.download = 'roast-card.png';
  link.href = canvas.toDataURL();
  link.click();
}
```

**Leaderboard (localStorage for MVP):**
```typescript
interface LeaderboardEntry {
  address: string;
  degenScore: number;
  roastPreview: string;
  timestamp: Date;
}

// Store in localStorage
// Display top 10 worst wallets
// Allow users to see full roast on click
```

---

## API Specifications

### POST `/api/roast`

**Request:**
```json
{
  "address": "0x1234567890abcdef",
  "severity": "nuclear",
  "style": "comedian"
}
```

**Response:**
```json
{
  "roast": "You spent more on gas fees...",
  "stats": {
    "gasWasted": "2.4 ETH",
    "worstTrade": "-$5,200 on SCAM420",
    "failureRate": 0.23,
    "degenScore": 87
  },
  "badges": [
    {
      "id": "gas-burner",
      "name": "Gas Burner",
      "icon": "🔥",
      "description": "Wasted over 1 ETH in gas"
    }
  ]
}
```

### GET `/api/transactions/:address`

**Response:**
```json
{
  "transactions": [...],
  "analysis": {
    "totalGasSpent": "2.4",
    "failedCount": 23,
    "patterns": ["FOMO", "PAPER_HANDS"]
  }
}
```

---

## UI/UX Flow

### State Machine

```
IDLE
  ↓ (click connect)
CONNECTING
  ↓ (wallet connected)
CONNECTED
  ↓ (click roast)
FETCHING_DATA
  ↓ (data loaded)
ANALYZING
  ↓ (analysis complete)
GENERATING_ROAST
  ↓ (roast ready)
DISPLAYING_ROAST
  ↓ (share/download/roast again)
IDLE
```

### Error States

- Wallet connection failed
- No transactions found
- API rate limit hit
- AI generation failed

For each: friendly error message + retry button

---

## Viral Mechanics

### Social Proof
- "23,847 wallets roasted"
- Live feed of recent roasts (addresses only)
- Hall of shame leaderboard

### Sharing Incentives
- Generated image optimized for Twitter
- Pre-written tweet text
- Unique roast IDs for permalinks
- "Roast your friend" challenge

### Gamification
- Badge system (Gas Burner, Paper Hands, NFT Degen)
- Degen Score (0-100)
- Worst trade of the day
- Weekly hall of fame

### Hooks
- Compare with someone else
- Track roast over time
- Get therapy after roast (funny)
- Redemption mode (show improvements)

---

## Success Metrics

### Hackathon Demo
- [ ] Works on Flow EVM testnet
- [ ] Can roast any wallet in <10 seconds
- [ ] Generated cards look clean
- [ ] Twitter share works
- [ ] Leaderboard displays

### Post-Hackathon
- Total wallets roasted
- Share rate (% who share to Twitter)
- Return users (roast again)
- Viral coefficient (invites per user)

---

## Risk Mitigation

### Technical Risks
- **API rate limits**: 
  - Cache Blockscout results (1 hour TTL)
  - Implement request queuing
  - User rate limiting (3 roasts/min per wallet)
- **AI failures**: 
  - Have 5-10 template fallback roasts
  - Graceful error messages
  - Retry logic with exponential backoff
- **Slow blockchain RPCs**: 
  - Set 10s timeout on RPC calls
  - Show loading states
  - Use public RPC as fallback

### Product Risks  
- **Roasts too mean**: 
  - Test roasts on real wallets
  - Add disclaimer "for entertainment only"
  - Option to regenerate with "milder" setting
- **Not funny enough**: 
  - Test prompt engineering on 20+ wallets
  - Have friends review roasts
  - Iterate on prompt based on feedback
- **Privacy concerns**: 
  - Truncate addresses (0x1234...5678)
  - No personal data stored
  - Anonymous leaderboard

### Hackathon Risks
- **Time crunch**: 
  - Cut scope to MVP only
  - Pre-build components before hackathon
  - Use Scaffold-ETH components (Address, Balance, etc.)
- **Demo fails**: 
  - Record video backup
  - Have 5+ test wallets ready
  - Local fallback if API fails
- **Network issues**: 
  - Test on Flow testnet beforehand
  - Have localhost demo ready
  - Cache example roasts

---

## Launch Checklist

### Pre-Demo
- [ ] Deploy to Vercel
- [ ] Set environment variables (ANTHROPIC_API_KEY)
- [ ] Test on 10+ different wallets (varied transaction history)
- [ ] Prepare pitch deck (problem → solution → demo → traction)
- [ ] Record 2-minute demo video (backup)
- [ ] Pre-generate 5 example roasts
- [ ] Test share functionality end-to-end
- [ ] Check mobile responsiveness

### Demo Day
- [ ] Live site URL ready
- [ ] QR code for audience
- [ ] Backup video if WiFi fails
- [ ] Social media ready to share

### Post-Hackathon
- [ ] Submit to Flow ecosystem list
- [ ] Post on crypto Twitter
- [ ] Share in Discord servers
- [ ] Write launch blog post

---

## Future Roadmap

### v1.1 (Week 1)
- Multiple roast styles
- Save roast history
- Compare with friends

### v1.2 (Week 2)
- Mint roast as NFT
- Premium roasts (pay with FLOW)
- Roast battles (PvP mode)

### v2.0 (Month 1)
- Multi-chain support
- DeFi protocol integration
- AI-generated memes
- Mobile app

---

## Resources

### Documentation
- [Scaffold-ETH Docs](https://docs.scaffoldeth.io/)
- [Flow EVM Docs](https://developers.flow.com/evm/about)
- [Wagmi v2 Docs](https://wagmi.sh/)
- [Viem Docs](https://viem.sh/)
- [Claude API Docs](https://docs.anthropic.com/)
- [Blockscout API](https://evm.flowscan.io/api-docs)

### Packages to Install
```bash
cd packages/nextjs
yarn add @anthropic-ai/sdk html2canvas
```

### Key Scaffold-ETH Hooks to Use
- `useAccount()` from wagmi - Get connected wallet
- `<Address>` component - Display wallet addresses
- `<Balance>` component - Show wallet balance
- `<RainbowKitCustomConnectButton>` - Wallet connection

### Flow EVM Resources
- [Flow Faucet](https://testnet-faucet.onflow.org/) - Get testnet FLOW
- [Flowscan Explorer](https://evm.flowscan.io/) - Blockchain explorer
- [Flow Discord](https://discord.gg/flow) - Community support

---

## Team Roles (if applicable)

- **Frontend**: Main UI, card generation
- **Backend**: Transaction parsing, API routes
- **AI**: Prompt engineering, roast generation
- **Design**: Card layout, branding, animations

---

**Build fast. Ship faster. Get roasted. 🔥**