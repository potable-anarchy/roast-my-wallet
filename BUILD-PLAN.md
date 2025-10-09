# Roast My Wallet - Build Plan

## 📋 What We Have

✅ **Design Document** (`design-doc.md`)
- Complete product specification
- Technical architecture
- Implementation plan
- API specifications

✅ **Scaffold-ETH 2 Documentation** (`llms-full.txt`)
- All hooks, components, and patterns
- Full reference for building

✅ **14 Prompt Files** (`prompts/*.prompt`)
- Step-by-step instructions for AI
- Ordered by dependencies
- Ready to process

✅ **Build Automation** (`prompts/process-prompts.js`)
- Sequential prompt processor
- Progress tracking
- Resume capability

## 🚀 How to Build

### Option 1: Interactive Build (Recommended)

```bash
cd prompts
node process-prompts.js
```

Then for each prompt:
1. Copy the displayed prompt
2. Paste into Claude/GPT-4
3. Get the generated code
4. Save to the TARGET file
5. Confirm and continue

**Time:** ~20-30 minutes

### Option 2: Manual Build

Process each prompt file manually:
1. Read `prompts/01-custom-chains.prompt`
2. Give it to AI assistant
3. Save generated code
4. Repeat for all 14 files

**Time:** ~30-45 minutes

### Option 3: Let Me Build It

Just say "build it" and I'll generate all the files directly!

**Time:** ~5-10 minutes

## 📦 What Gets Built

### Configuration (3 files)
- `packages/nextjs/utils/customChains.ts` - Flow EVM chains
- `packages/nextjs/scaffold.config.ts` - App config
- `packages/nextjs/.env.local` - Environment variables

### Types & Utils (3 files)
- `packages/nextjs/types/wallet.ts` - TypeScript interfaces
- `packages/nextjs/utils/transactionParser.ts` - Parse blockchain data
- `packages/nextjs/utils/blockscoutApi.ts` - Fetch transactions

### Backend API (1 file)
- `packages/nextjs/app/api/roast/route.ts` - AI roast generation

### Custom Hooks (2 files)
- `packages/nextjs/hooks/useWalletAnalysis.ts` - Analyze wallets
- `packages/nextjs/hooks/useRoastGenerator.ts` - Generate roasts

### UI Components (3 files)
- `packages/nextjs/components/RoastCard.tsx` - Display roast
- `packages/nextjs/components/LoadingRoast.tsx` - Loading animation
- `packages/nextjs/components/ShareButtons.tsx` - Share/download

### Main App (2 files)
- `packages/nextjs/app/page.tsx` - Main page
- `packages/nextjs/package.json` - Dependencies

**Total: 14 files**

## ✅ After Building

```bash
# 1. Install dependencies
cd packages/nextjs
yarn install

# 2. Set environment variables
# Edit packages/nextjs/.env.local
# Add: ANTHROPIC_API_KEY=sk-ant-...

# 3. Start development server
yarn start

# 4. Open browser
# http://localhost:3000
```

## 🔍 Validate Build

```bash
cd prompts
node validate-build.js
```

Shows which files are complete/missing.

## 🎯 Success Criteria

Your app is ready when:
- ✅ All 14 files generated
- ✅ `yarn install` completes without errors
- ✅ Environment variables set
- ✅ App starts on localhost:3000
- ✅ Can connect wallet
- ✅ Can generate and view roast
- ✅ Can share/download roast card

## 🐛 Troubleshooting

### "Module not found" errors
```bash
cd packages/nextjs
yarn install
```

### "API key not defined"
Check `.env.local` has `ANTHROPIC_API_KEY`

### "Cannot read property of undefined"
Check all 14 files were generated (run validate-build.js)

### TypeScript errors
Some may be normal during build. If app runs, you're good!

## 📊 Build Progress Tracker

```
[ ] 01-custom-chains.prompt
[ ] 02-scaffold-config.prompt
[ ] 03-env-local.prompt
[ ] 04-types.prompt
[ ] 05-transaction-parser.prompt
[ ] 06-blockscout-api.prompt
[ ] 07-roast-api-route.prompt
[ ] 08-use-wallet-analysis.prompt
[ ] 09-use-roast-generator.prompt
[ ] 10-roast-card-component.prompt
[ ] 11-loading-roast-component.prompt
[ ] 12-share-buttons-component.prompt
[ ] 13-main-page.prompt
[ ] 14-package-json-updates.prompt
```

## 🎬 Ready to Start?

Choose your path:

**A) Automated:** `cd prompts && node process-prompts.js`

**B) Let me do it:** Say "build all files now"

**C) See current status:** `cd prompts && node validate-build.js`

---

**Let's ship this! 🔥🚀**
