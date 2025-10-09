# 🔥 Roast My Wallet - Setup Guide

## ✅ What's Been Built

All 14 core files have been generated:

### Configuration (3 files)
- ✅ `packages/nextjs/utils/customChains.ts` - Flow EVM chain definitions
- ✅ `packages/nextjs/scaffold.config.ts` - Updated with Flow testnet
- ✅ `packages/nextjs/.env.local.example` - Environment template

### Types & Utilities (3 files)
- ✅ `packages/nextjs/types/wallet.ts` - TypeScript interfaces
- ✅ `packages/nextjs/utils/transactionParser.ts` - Analyze blockchain data
- ✅ `packages/nextjs/utils/blockscoutApi.ts` - Fetch transactions with caching

### Backend (1 file)
- ✅ `packages/nextjs/app/api/roast/route.ts` - AI roast generation API

### Custom Hooks (2 files)
- ✅ `packages/nextjs/hooks/useWalletAnalysis.ts` - Fetch & analyze wallet
- ✅ `packages/nextjs/hooks/useRoastGenerator.ts` - Generate AI roasts

### UI Components (3 files)
- ✅ `packages/nextjs/components/RoastCard.tsx` - Roast card display
- ✅ `packages/nextjs/components/LoadingRoast.tsx` - Loading animation
- ✅ `packages/nextjs/components/ShareButtons.tsx` - Share/download functionality

### Main App (2 files)
- ✅ `packages/nextjs/app/page.tsx` - Complete main page
- ✅ `packages/nextjs/package.json` - Updated with new dependencies

---

## 🚀 Setup Instructions

### Step 1: Install Dependencies

```bash
cd packages/nextjs
yarn install
```

This will install:
- `@anthropic-ai/sdk` - Claude AI integration
- `html2canvas` - Image generation for sharing
- All existing Scaffold-ETH dependencies

### Step 2: Configure Environment Variables

Create `.env.local` from the example:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Anthropic API key:

```bash
# Get your API key at: https://console.anthropic.com/
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here

# Flow EVM RPC (already configured)
NEXT_PUBLIC_FLOW_RPC_URL=https://testnet.evm.nodes.onflow.org
```

**Where to get API key:**
1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to API Keys
4. Create a new key
5. Copy and paste into `.env.local`

### Step 3: Start Development Server

```bash
yarn start
```

The app will be available at: http://localhost:3000

---

## 🧪 Testing the App

### 1. Connect Wallet
- Click "Connect Wallet"
- Select MetaMask or WalletConnect
- Make sure you're on **Flow EVM Testnet**

### 2. Get Testnet FLOW
If you need testnet tokens:
- Visit: https://testnet-faucet.onflow.org/
- Enter your wallet address
- Get free testnet FLOW

### 3. Test with Transactions
For best results, test with a wallet that has:
- Multiple transactions
- Some failed transactions (for better roasts)
- Various gas spending patterns

### 4. Generate Roast
- After connecting, click "🔥 ROAST MY WALLET 🔥"
- Wait for AI to generate roast (~5 seconds)
- View your roast card with stats and badges

### 5. Share/Download
- Click "Share on Twitter" to post
- Click "Download Image" to save as PNG
- Click "Roast Again" to generate a new roast

---

## 🔧 Troubleshooting

### TypeScript Errors
The TypeScript errors you're seeing are expected until `yarn install` completes:
- `Cannot find module 'wagmi'` → Fixed after install
- `Cannot find module '@anthropic-ai/sdk'` → Fixed after install
- `Cannot find module 'viem'` → Fixed after install

### "No transactions found"
- Make sure you're connected to Flow EVM Testnet (Chain ID: 545)
- The wallet needs at least 1 transaction on Flow EVM
- Try a different wallet if needed

### "Rate limit exceeded"
- Wait 1 minute between roast attempts
- Rate limit: 3 roasts per minute per wallet

### "Failed to generate roast"
- Check your `ANTHROPIC_API_KEY` in `.env.local`
- Verify the API key is valid
- Check console for detailed errors
- App will use fallback roasts if API fails

### Blockscout API Errors
- The Blockscout API might be slow or rate-limited
- Results are cached for 1 hour to reduce load
- Try again after a few seconds if it fails

---

## 📂 Project Structure

```
packages/nextjs/
├── app/
│   ├── api/roast/route.ts          # AI roast generation endpoint
│   └── page.tsx                     # Main app page
├── components/
│   ├── RoastCard.tsx               # Roast display card
│   ├── LoadingRoast.tsx            # Loading animation
│   └── ShareButtons.tsx            # Share/download buttons
├── hooks/
│   ├── useWalletAnalysis.ts        # Wallet analysis hook
│   └── useRoastGenerator.ts        # Roast generation hook
├── types/
│   └── wallet.ts                   # TypeScript types
├── utils/
│   ├── customChains.ts             # Flow EVM chains
│   ├── blockscoutApi.ts            # Transaction fetching
│   └── transactionParser.ts        # Data analysis
├── scaffold.config.ts              # Scaffold-ETH config
├── .env.local                      # Environment variables
└── package.json                    # Dependencies
```

---

## 🎯 Feature Checklist

### Core Features
- ✅ Flow EVM Testnet integration
- ✅ Wallet connection (RainbowKit)
- ✅ Transaction fetching & caching
- ✅ Wallet analysis (gas, failures, patterns)
- ✅ AI roast generation (Claude)
- ✅ Degen score calculation (0-100)
- ✅ Badge system (7 types)
- ✅ Shareable roast cards
- ✅ Twitter sharing
- ✅ Image download
- ✅ Rate limiting
- ✅ Error handling
- ✅ Loading states

### Nice-to-Haves (Not implemented yet)
- ⏳ Roast severity slider
- ⏳ Multiple roast styles
- ⏳ Leaderboard
- ⏳ Historical roasts
- ⏳ Comparison mode

---

## 🚢 Deployment

### Deploy to Vercel

1. **Push to GitHub:**
```bash
git add .
git commit -m "Add Roast My Wallet app"
git push
```

2. **Connect to Vercel:**
- Go to https://vercel.com
- Import your repository
- Vercel will auto-detect Next.js

3. **Set Environment Variables:**
In Vercel dashboard:
- Add `ANTHROPIC_API_KEY`
- Add `NEXT_PUBLIC_FLOW_RPC_URL`

4. **Deploy:**
```bash
yarn vercel --prod
```

---

## 🎨 Customization

### Change Chain
Edit `packages/nextjs/scaffold.config.ts`:
```typescript
import { flowMainnet } from "./utils/customChains";

const scaffoldConfig = {
  targetNetworks: [flowMainnet], // Switch to mainnet
  // ...
};
```

### Adjust Roast Tone
Edit `packages/nextjs/app/api/roast/route.ts`:
- Modify `buildRoastPrompt()` function
- Change instructions to Claude
- Adjust temperature/creativity

### Customize UI
All components use:
- Tailwind CSS classes
- daisyUI components
- Easy to modify colors, spacing, etc.

---

## 📊 API Limits & Costs

### Anthropic Claude API
- Free tier: 50 requests/min
- Cost: ~$0.003 per roast (500 tokens)
- 1000 roasts = ~$3

### Blockscout API
- Free public API
- Rate limit: ~5 requests/sec
- Caching reduces calls

---

## 🐛 Common Issues

**Q: App won't start**
A: Run `yarn install` in `packages/nextjs`

**Q: Wallet won't connect**
A: Make sure MetaMask has Flow EVM Testnet added

**Q: Roasts are generic**
A: Needs wallet with more transaction history

**Q: Download doesn't work**
A: Browser might block downloads - allow in settings

**Q: Twitter share doesn't open**
A: Pop-up blocked - allow pop-ups for the site

---

## 📚 Resources

- [Scaffold-ETH 2 Docs](https://docs.scaffoldeth.io/)
- [Flow EVM Docs](https://developers.flow.com/evm)
- [Claude API Docs](https://docs.anthropic.com/)
- [Blockscout API](https://evm-testnet.flowscan.io/api-docs)
- [Wagmi Docs](https://wagmi.sh/)
- [Viem Docs](https://viem.sh/)

---

## 🎉 You're Ready!

Run these commands to start:

```bash
cd packages/nextjs
yarn install
cp .env.local.example .env.local
# Edit .env.local with your ANTHROPIC_API_KEY
yarn start
```

Then visit: http://localhost:3000

**Build fast. Ship faster. Get roasted. 🔥**
