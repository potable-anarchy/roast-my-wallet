# 🎭 Demo Mode - Test Without a Wallet!

## What Is Demo Mode?

Demo mode lets you **test all features** without connecting a wallet or having any transactions on Flow EVM.

Perfect for:
- ✅ Testing the UI/UX
- ✅ Demoing to judges
- ✅ Taking screenshots
- ✅ Showing friends
- ✅ Development/debugging

---

## How to Use

### Option 1: Click the Button

1. Start the app: `yarn start`
2. Open: http://localhost:3000
3. Click **"Try Demo Mode"** button
4. Instantly see a full roast with fake data!

### Option 2: Direct Start

Just open the app and click the demo button - no setup needed!

---

## What Demo Mode Shows

### Mock Wallet Stats:
- **Address:** `0x1234...7890` (fake)
- **Transactions:** 247
- **Gas Wasted:** 2.847 ETH
- **Failed Transactions:** 34 (13.7% failure rate)
- **Degen Score:** 73/100
- **Account Age:** 180 days

### Badges Earned:
- 🔥 **Gas Burner** (Rare)
- 📄 **Paper Hands** (Rare)
- 🧠 **Smooth Brain** (Rare)

### AI Roast:
Pre-written savage roast about the mock wallet's poor decisions

---

## Features You Can Test

✅ **Roast Card Display** - See the full card layout  
✅ **Stats Grid** - Gas, failures, transactions, score  
✅ **Badge System** - Multiple badges with rarities  
✅ **Download Image** - Export roast card as PNG  
✅ **Share to Twitter** - Generate shareable tweet  
✅ **Responsive Design** - Test on mobile/desktop  

---

## What's Different in Demo Mode?

### Same:
- ✅ All UI components
- ✅ Card design
- ✅ Download functionality
- ✅ Share buttons
- ✅ Stats display
- ✅ Badge rendering

### Different:
- ❌ No real wallet connection
- ❌ No API calls to Blockscout
- ❌ No Gemini AI call (uses pre-written roast)
- ❌ Static data (doesn't change)

---

## Exiting Demo Mode

Click **"Roast Again"** button to exit and return to the main screen.

Then you can:
- Connect a real wallet
- Or try demo mode again

---

## For Hackathon Judges

Demo mode is perfect for your presentation:

1. **No wallet needed** - Show it working immediately
2. **No API keys** - Works even without Gemini setup
3. **Instant load** - No waiting for blockchain data
4. **Full experience** - Every feature visible
5. **Reliable** - Won't fail due to network issues

### Presentation Flow:

```
1. Open app → "Here's the landing page"
2. Click Demo → "Let me show you what it does"
3. Show roast card → "AI analyzes transactions"
4. Show stats → "Calculates degen score and badges"
5. Click download → "Users can save and share"
6. Click Twitter → "Goes viral on social media"
```

---

## Development Benefits

### Testing:
- No need for testnet FLOW
- No need for transaction history
- No need for API keys (for UI testing)
- Instant feedback loop

### Debugging:
- Isolated UI testing
- No blockchain variables
- Consistent data
- Fast iteration

### Screenshots:
- Always looks good
- Same data every time
- Perfect for documentation
- Great for marketing

---

## Customizing Demo Data

Want different demo stats? Edit `packages/nextjs/app/page.tsx`:

```typescript
const DEMO_ANALYSIS: WalletAnalysis = {
  totalTransactions: 247,  // Change this
  totalGasSpent: "2.847",  // Or this
  failedTransactions: 34,  // Or this
  // ... etc
};

const DEMO_ROAST = `Your custom roast text here...`;
```

---

## Pro Tips

### For Demos:
1. Start in demo mode
2. Show full flow
3. Then connect real wallet for "live" demo
4. Fallback to demo if network issues

### For Screenshots:
1. Use demo mode
2. Download the card
3. Perfect for social media
4. Consistent branding

### For Testing:
1. Test UI changes instantly
2. No blockchain delays
3. No API rate limits
4. Iterate fast

---

## FAQ

**Q: Does demo mode use Gemini AI?**  
A: No, it uses a pre-written roast. This way it works instantly and doesn't use API credits.

**Q: Can I share demo mode results?**  
A: Yes! Download and Twitter share work fine. Just note it's demo data.

**Q: Will demo mode show my real wallet?**  
A: No, it uses a fake address. Your real wallet isn't accessed.

**Q: Can I edit the demo roast?**  
A: Yes! Edit the `DEMO_ROAST` constant in `page.tsx`.

---

## Summary

Demo mode = **Full app experience without any wallet or blockchain**

Perfect for:
- 🎤 Presentations
- 🐛 Development  
- 📸 Screenshots
- 🧪 Testing
- 👥 Sharing

**Just click "Try Demo Mode" and start roasting! 🔥**
