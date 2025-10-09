# Quick Start Guide - Build in Minutes

## One-Command Setup

```bash
cd prompts
node process-prompts.js
```

## What Happens Next?

The script will show you 14 prompts, one at a time. For each:

1. **Read the prompt** (it tells the AI what to build)
2. **Copy everything** displayed in the terminal
3. **Paste into Claude/GPT** in your browser
4. **Copy the generated code** from AI
5. **Save to the file** shown in TARGET
6. **Hit 'y'** to mark as done and continue

## Example Flow

```
Terminal shows:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Processing: 01-custom-chains.prompt
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Target: packages/nextjs/utils/customChains.ts
Description: Define Flow EVM chain configs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create a TypeScript file that defines...
[full prompt content]

✅ Completed 01-custom-chains.prompt? (y/n):
```

You:
1. Copy the prompt text
2. Paste in Claude: "Here's what I need"
3. Claude generates the code
4. You save to `packages/nextjs/utils/customChains.ts`
5. Type `y` and press Enter

Repeat 14 times. Done! 🎉

## Pro Tips

### Pause Anytime
Press `n` to pause. Resume later with:
```bash
node process-prompts.js --resume
```

### Skip Ahead
Edit `.completed-prompts` file to mark files as done.

### Auto Mode (Advanced)
```bash
node process-prompts.js --auto
# Shows all prompts without waiting
# Good for batch processing
```

## After All Prompts

```bash
cd packages/nextjs
yarn install                    # Install new packages
# Edit .env.local                # Add ANTHROPIC_API_KEY
yarn start                      # Launch app!
```

## Time Estimate

- **With AI**: ~20-30 minutes total
  - 14 prompts × 1-2 minutes each
  - Plus install/setup time

- **Manual coding**: 8-10 hours
  - Yeah, AI is faster 🚀

## Stuck?

Check `processing-log.txt` for history.

Need help? See full README.md.

---

**Let's build! 🔥**
