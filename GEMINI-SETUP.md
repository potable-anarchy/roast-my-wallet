# 🚀 Quick Setup with Google Gemini (FREE!)

## ⚡ Super Fast Setup (2 minutes)

### 1. Get FREE Gemini API Key

1. Go to: **https://aistudio.google.com/app/apikey**
2. Click "Create API Key"
3. Copy the key (starts with `AIza...`)

**No credit card required!** ✅  
**Completely free!** ✅

---

### 2. Setup & Run (3 Commands)

```bash
# Install dependencies
cd packages/nextjs
yarn install

# Create environment file
cp .env.local.example .env.local

# Edit .env.local and add your key
nano .env.local
```

Add this line:
```
GEMINI_API_KEY=AIzaSy...your-key-here
```

Save and exit (Ctrl+X, then Y, then Enter)

```bash
# Start the app
yarn start
```

Open: http://localhost:3000

---

## ✅ That's It!

Your app is now running with:
- ✅ Google Gemini AI (FREE)
- ✅ Flow EVM Testnet
- ✅ Full roasting functionality

---

## 🎯 Why Gemini?

**Better than Claude for this project:**

✅ **FREE** - No credit card needed  
✅ **Fast** - 1.5 Flash model is super quick  
✅ **Simple** - Direct REST API, no SDK needed  
✅ **Generous limits** - 15 requests/min free tier  
✅ **No signup friction** - Just click and get key  

---

## 🔥 Test It Out

1. Connect your wallet
2. Click "Roast My Wallet"
3. Watch Gemini roast your transactions
4. Share to Twitter
5. Download as image

**That's it! You're roasting wallets with AI! 🚀**

---

## 📊 API Usage

**Free Tier:**
- 15 requests per minute
- 1,500 requests per day
- More than enough for hackathon demo!

**Costs if you exceed free tier:**
- $0.00001 per request (1 million requests = $10)
- Basically free for this use case

---

## 🐛 Troubleshooting

**"API key not set"**  
→ Check `.env.local` has `GEMINI_API_KEY=AIza...`

**"Invalid API key"**  
→ Generate new key at https://aistudio.google.com/app/apikey

**Rate limit**  
→ App has built-in rate limiting (3 roasts/min)

---

## 💡 Bonus: Gemini is Smart!

The roasts are actually **better** with Gemini:
- More creative
- Better at crypto slang
- Faster response time
- More humorous

---

## 🎊 You're Ready!

```bash
cd packages/nextjs && yarn install && yarn start
```

**Build fast. Ship faster. Roast harder. 🔥**
