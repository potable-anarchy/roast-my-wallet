#!/usr/bin/env node

/**
 * Process .prompt files sequentially to generate code files
 * This avoids rate limits and maximizes context window usage
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configuration
const PROMPTS_DIR = path.join(__dirname);
const DELAY_BETWEEN_PROMPTS = 3000; // 3 seconds between prompts
const OUTPUT_LOG = path.join(__dirname, 'processing-log.txt');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  const timestamp = new Date().toISOString();
  const coloredMessage = `${colors[color]}${message}${colors.reset}`;
  console.log(`[${timestamp}] ${coloredMessage}`);
  
  // Also log to file
  fs.appendFileSync(OUTPUT_LOG, `[${timestamp}] ${message}\n`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getPromptFiles() {
  const files = fs.readdirSync(PROMPTS_DIR)
    .filter(file => file.endsWith('.prompt'))
    .sort((a, b) => {
      // Sort by number prefix if exists
      const aNum = parseInt(a.match(/^(\d+)/)?.[1] || '999');
      const bNum = parseInt(b.match(/^(\d+)/)?.[1] || '999');
      return aNum - bNum;
    });
  
  return files;
}

function parsePromptFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  const metadata = {
    targetFile: '',
    description: '',
    dependencies: [],
    priority: 'normal',
  };
  
  let promptContent = '';
  let inMetadata = false;
  
  for (const line of lines) {
    if (line.trim() === '---METADATA---') {
      inMetadata = true;
      continue;
    }
    if (line.trim() === '---END_METADATA---') {
      inMetadata = false;
      continue;
    }
    
    if (inMetadata) {
      if (line.startsWith('TARGET:')) {
        metadata.targetFile = line.replace('TARGET:', '').trim();
      } else if (line.startsWith('DESCRIPTION:')) {
        metadata.description = line.replace('DESCRIPTION:', '').trim();
      } else if (line.startsWith('DEPENDENCIES:')) {
        metadata.dependencies = line.replace('DEPENDENCIES:', '')
          .trim()
          .split(',')
          .map(d => d.trim())
          .filter(d => d);
      } else if (line.startsWith('PRIORITY:')) {
        metadata.priority = line.replace('PRIORITY:', '').trim();
      }
    } else {
      promptContent += line + '\n';
    }
  }
  
  return { metadata, promptContent: promptContent.trim() };
}

function displayPrompt(filename, metadata, promptContent) {
  console.log('\n' + '='.repeat(80));
  log(`📝 Processing: ${filename}`, 'cyan');
  console.log('='.repeat(80));
  log(`Target: ${metadata.targetFile}`, 'blue');
  log(`Description: ${metadata.description}`, 'blue');
  if (metadata.dependencies.length > 0) {
    log(`Dependencies: ${metadata.dependencies.join(', ')}`, 'yellow');
  }
  log(`Priority: ${metadata.priority}`, 'yellow');
  console.log('\n' + '-'.repeat(80));
  console.log('PROMPT CONTENT:');
  console.log('-'.repeat(80));
  console.log(promptContent);
  console.log('-'.repeat(80) + '\n');
}

async function askForConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

async function processPrompts(options = {}) {
  const { autoMode = false, skipCompleted = false } = options;
  
  log('🚀 Starting prompt processing...', 'green');
  log(`Auto mode: ${autoMode}`, 'blue');
  log(`Skip completed: ${skipCompleted}`, 'blue');
  
  const promptFiles = getPromptFiles();
  log(`Found ${promptFiles.length} prompt files`, 'green');
  
  const completedFile = path.join(__dirname, '.completed-prompts');
  let completed = new Set();
  
  if (skipCompleted && fs.existsSync(completedFile)) {
    const completedList = fs.readFileSync(completedFile, 'utf-8')
      .split('\n')
      .filter(line => line.trim());
    completed = new Set(completedList);
    log(`Loaded ${completed.size} completed prompts`, 'yellow');
  }
  
  for (let i = 0; i < promptFiles.length; i++) {
    const filename = promptFiles[i];
    const filePath = path.join(PROMPTS_DIR, filename);
    
    if (skipCompleted && completed.has(filename)) {
      log(`⏭️  Skipping completed: ${filename}`, 'yellow');
      continue;
    }
    
    try {
      const { metadata, promptContent } = parsePromptFile(filePath);
      
      displayPrompt(filename, metadata, promptContent);
      
      if (!autoMode) {
        log('\n📋 Copy the prompt above and paste it into your AI assistant', 'green');
        log('The AI should generate the file at the TARGET location.', 'green');
        
        const shouldContinue = await askForConfirmation(
          `\n✅ Completed ${filename}? (y/n): `
        );
        
        if (shouldContinue) {
          // Mark as completed
          fs.appendFileSync(completedFile, `${filename}\n`);
          completed.add(filename);
          log(`✅ Marked as completed: ${filename}`, 'green');
        } else {
          log(`⏸️  Pausing at: ${filename}`, 'yellow');
          log(`Resume with: node process-prompts.js --resume`, 'blue');
          break;
        }
      } else {
        // In auto mode, just display and wait
        log(`Displayed prompt ${i + 1}/${promptFiles.length}`, 'blue');
      }
      
      // Delay between prompts to avoid overwhelming the user
      if (i < promptFiles.length - 1) {
        log(`⏳ Waiting ${DELAY_BETWEEN_PROMPTS / 1000}s before next prompt...`, 'yellow');
        await sleep(DELAY_BETWEEN_PROMPTS);
      }
      
    } catch (error) {
      log(`❌ Error processing ${filename}: ${error.message}`, 'red');
      if (!autoMode) {
        const shouldContinue = await askForConfirmation('Continue with next prompt? (y/n): ');
        if (!shouldContinue) break;
      }
    }
  }
  
  log('\n🎉 All prompts processed!', 'green');
  log(`Check ${OUTPUT_LOG} for full log`, 'blue');
}

// CLI argument parsing
const args = process.argv.slice(2);
const options = {
  autoMode: args.includes('--auto'),
  skipCompleted: args.includes('--resume') || args.includes('--skip-completed'),
};

// Help text
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Prompt Processing Script
========================

Usage: node process-prompts.js [options]

Options:
  --auto              Display all prompts without confirmation
  --resume            Skip prompts that have been marked as completed
  --skip-completed    Same as --resume
  --help, -h          Show this help message

Examples:
  node process-prompts.js                    # Interactive mode
  node process-prompts.js --auto             # Display all prompts
  node process-prompts.js --resume           # Continue from where you left off

The script will:
1. Read all .prompt files in order
2. Display each prompt with metadata
3. Wait for confirmation before moving to the next
4. Track completed prompts in .completed-prompts file
  `);
  process.exit(0);
}

// Run the script
processPrompts(options).catch(error => {
  log(`❌ Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
