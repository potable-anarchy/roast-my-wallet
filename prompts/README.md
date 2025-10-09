# Roast My Wallet - Build Prompts

This directory contains `.prompt` files that can be processed by AI assistants to generate the actual code files for the Roast My Wallet application.

## Quick Start

### Prerequisites
- Node.js installed
- Scaffold-ETH 2 project initialized

### Usage

1. **Install dependencies for the script:**
   ```bash
   # No dependencies needed - uses Node.js built-ins
   ```

2. **Run the prompt processor:**
   ```bash
   cd prompts
   node process-prompts.js
   ```

3. **Follow the interactive flow:**
   - The script will display each prompt in order
   - Copy the prompt content
   - Paste it into your AI assistant (Claude, GPT-4, etc.)
   - Let the AI generate the file at the TARGET location
   - Confirm completion when done
   - Move to next prompt

### Command Options

```bash
# Interactive mode (recommended)
node process-prompts.js

# Display all prompts without confirmation
node process-prompts.js --auto

# Resume from where you left off
node process-prompts.js --resume

# Show help
node process-prompts.js --help
```

## Prompt Files

Files are numbered in dependency order:

1. **01-custom-chains.prompt** - Define Flow EVM chains
2. **02-scaffold-config.prompt** - Update scaffold config
3. **03-env-local.prompt** - Environment variables
4. **04-types.prompt** - TypeScript types
5. **05-transaction-parser.prompt** - Parse blockchain data
6. **06-blockscout-api.prompt** - Fetch transactions
7. **07-roast-api-route.prompt** - AI roast generation API
8. **08-use-wallet-analysis.prompt** - Wallet analysis hook
9. **09-use-roast-generator.prompt** - Roast generation hook
10. **10-roast-card-component.prompt** - Display roast card
11. **11-loading-roast-component.prompt** - Loading animation
12. **12-share-buttons-component.prompt** - Share/download
13. **13-main-page.prompt** - Main app page
14. **14-package-json-updates.prompt** - Dependencies

## Prompt File Format

Each `.prompt` file has this structure:

```
---METADATA---
TARGET: path/to/file.ts
DESCRIPTION: What this file does
DEPENDENCIES: other-prompt-files
PRIORITY: high/medium/low
---END_METADATA---

[Detailed instructions for AI to generate the file]
```

## Tips for Using with AI

### For Claude/GPT-4:
1. Copy the entire prompt content (including metadata)
2. Paste into chat
3. AI will generate the file content
4. Save the generated code to the TARGET path
5. Verify it works before moving to next prompt

### Context Window Management:
- Process prompts in order (dependencies first)
- Each prompt is self-contained
- Reference the design-doc.md for overall context
- Reference llms-full.txt for Scaffold-ETH patterns

### If Something Goes Wrong:
- Check the processing-log.txt file
- Use `--resume` to skip completed prompts
- Re-run specific prompts by modifying .completed-prompts file

## Workflow

```
Start
  ↓
Run process-prompts.js
  ↓
Display Prompt #1
  ↓
Copy → Paste to AI → Generate Code → Save File
  ↓
Confirm completion
  ↓
Display Prompt #2
  ↓
... (repeat)
  ↓
All prompts processed ✅
  ↓
Run yarn install
  ↓
Set ANTHROPIC_API_KEY in .env.local
  ↓
yarn start
```

## After All Prompts Are Processed

1. **Install dependencies:**
   ```bash
   cd packages/nextjs
   yarn install
   ```

2. **Set environment variables:**
   ```bash
   # Edit packages/nextjs/.env.local
   # Add your ANTHROPIC_API_KEY
   ```

3. **Start the development server:**
   ```bash
   yarn start
   ```

4. **Test the app:**
   - Connect wallet
   - Roast your wallet
   - Download/share roast card

## Troubleshooting

### Prompt script won't run
```bash
chmod +x process-prompts.js
node process-prompts.js
```

### Want to reset progress
```bash
rm .completed-prompts
rm processing-log.txt
```

### AI generates invalid code
- Review the prompt instructions
- Check dependencies are in place
- Reference design-doc.md for context
- Try rephrasing or adding more details

### Rate limits with AI
- Use the built-in delays (3 seconds between prompts)
- Use `--resume` to continue after breaks
- Process in smaller batches

## Support

- Design Document: `../design-doc.md`
- Scaffold-ETH Docs: `../llms-full.txt`
- Flow EVM Docs: https://developers.flow.com/evm
- Claude API Docs: https://docs.anthropic.com/

---

**Build fast. Ship faster. Get roasted. 🔥**
