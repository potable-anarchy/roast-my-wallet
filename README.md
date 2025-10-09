# 🔥 Roast My Wallet

> Built for **Forte Hacks** - A brutally honest AI-powered wallet roaster for Flow EVM

<h4 align="center">
  <a href="https://roast-my-wallet-9ze467677-bradtacos-projects.vercel.app">Live Demo</a> |
  <a href="https://www.hackquest.io/hackathons/Forte-Hacks">Hackathon Submission</a>
</h4>

## 🎯 About

Roast My Wallet is an AI-powered dApp that analyzes your Flow EVM wallet transactions and delivers brutally honest roasts about your trading behavior. Get a degen score (0-100), earn badges based on your trading patterns, and share your roasts on social media.

⚙️ Built using NextJS, RainbowKit, Wagmi, Viem, TypeScript, and powered by Google's Gemini AI.

## ✨ Features

- 🔥 **AI-Powered Roasts**: Get brutally honest feedback on your trading behavior using Google's Gemini AI
- 📊 **Degen Score**: Receive a score from 0-100 based on your transaction patterns
- 🏆 **Badge System**: Earn badges like "Gas Guzzler", "Diamond Hands", "Paper Hands", and more
- 🌐 **Flow EVM Integration**: Analyzes real transactions on Flow EVM testnet
- 📱 **Social Sharing**: Share your roasts on social media
- 🎭 **Demo Mode**: Try it out without connecting a wallet

## 🔗 Hackathon Resources

- **Hackathon**: [Forte Hacks on HackQuest](https://www.hackquest.io/hackathons/Forte-Hacks)
- **Submit Project**: [Submission Portal](https://www.hackquest.io/hackathons/Forte-Hacks)
- **Flow EVM Docs**: [Flow EVM Documentation](https://developers.flow.com/evm/about)
- **Flow Testnet**: [Flow EVM Testnet Explorer](https://evm-testnet.flowscan.io/)
- **Gemini AI**: [Google Gemini API](https://ai.google.dev/)

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Web3**: RainbowKit, Wagmi, Viem
- **Blockchain**: Flow EVM Testnet
- **AI**: Google Gemini 1.5 Flash
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## 🚀 Quick Start

### Requirements

Before you begin, you need to install the following tools:

- [Node (>= v20.18.3)](https://nodejs.org/en/download/)
- [Yarn](https://yarnpkg.com/getting-started/install)
- [Git](https://git-scm.com/downloads)

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd scaffold-eth-2
```

2. Install dependencies:

```bash
yarn install
```

3. Set up environment variables:

Create a `.env` file in `packages/nextjs/` with:

```
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

4. Start the development server:

```bash
yarn start
```

Visit your app at: `http://localhost:3000`

### Configuration

The app is configured to work with Flow EVM testnet by default. You can modify the network settings in `packages/nextjs/scaffold.config.ts`.

### Testing with Demo Mode

You can try the app without connecting a wallet using the "Try Demo" button on the homepage.

## 📖 How It Works

1. **Connect Wallet**: Connect your Flow EVM wallet or try the demo mode
2. **Analyze Transactions**: The app fetches your transaction history from Flow EVM testnet
3. **AI Analysis**: Gemini AI analyzes your trading patterns, gas usage, and transaction behavior
4. **Get Roasted**: Receive a brutally honest roast, degen score, and badges
5. **Share**: Share your results on social media

## 🏗 Built With Scaffold-ETH 2

This project is built using [Scaffold-ETH 2](https://scaffoldeth.io), an open-source toolkit for building dApps on Ethereum and EVM-compatible chains.

- [Scaffold-ETH 2 Documentation](https://docs.scaffoldeth.io)
- [Scaffold-ETH 2 GitHub](https://github.com/scaffold-eth/scaffold-eth-2)

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built for [Forte Hacks](https://www.hackquest.io/hackathons/Forte-Hacks)
- Powered by [Flow EVM](https://developers.flow.com/evm/about)
- AI by [Google Gemini](https://ai.google.dev/)
- Framework by [Scaffold-ETH 2](https://scaffoldeth.io)
