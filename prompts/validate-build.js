#!/usr/bin/env node

/**
 * Validate that all required files were generated from prompts
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  const fullPath = path.join(__dirname, '..', filePath);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    const stats = fs.statSync(fullPath);
    const isEmpty = stats.size === 0;
    
    if (isEmpty) {
      log(`⚠️  ${description}`, 'yellow');
      log(`   Path: ${filePath}`, 'yellow');
      log(`   Status: EXISTS BUT EMPTY`, 'yellow');
      return 'empty';
    } else {
      log(`✅ ${description}`, 'green');
      return 'exists';
    }
  } else {
    log(`❌ ${description}`, 'red');
    log(`   Path: ${filePath}`, 'red');
    log(`   Status: NOT FOUND`, 'red');
    return 'missing';
  }
}

function main() {
  log('\n🔍 Validating Build Files...\n', 'cyan');
  
  const files = [
    {
      path: 'packages/nextjs/utils/customChains.ts',
      description: 'Flow EVM Chain Definitions',
      required: true,
    },
    {
      path: 'packages/nextjs/scaffold.config.ts',
      description: 'Scaffold Config (should be updated)',
      required: true,
    },
    {
      path: 'packages/nextjs/.env.local',
      description: 'Environment Variables',
      required: true,
    },
    {
      path: 'packages/nextjs/types/wallet.ts',
      description: 'TypeScript Types',
      required: true,
    },
    {
      path: 'packages/nextjs/utils/transactionParser.ts',
      description: 'Transaction Parser',
      required: true,
    },
    {
      path: 'packages/nextjs/utils/blockscoutApi.ts',
      description: 'Blockscout API Client',
      required: true,
    },
    {
      path: 'packages/nextjs/app/api/roast/route.ts',
      description: 'Roast API Route',
      required: true,
    },
    {
      path: 'packages/nextjs/hooks/useWalletAnalysis.ts',
      description: 'Wallet Analysis Hook',
      required: true,
    },
    {
      path: 'packages/nextjs/hooks/useRoastGenerator.ts',
      description: 'Roast Generator Hook',
      required: true,
    },
    {
      path: 'packages/nextjs/components/RoastCard.tsx',
      description: 'Roast Card Component',
      required: true,
    },
    {
      path: 'packages/nextjs/components/LoadingRoast.tsx',
      description: 'Loading Animation Component',
      required: false,
    },
    {
      path: 'packages/nextjs/components/ShareButtons.tsx',
      description: 'Share Buttons Component',
      required: true,
    },
    {
      path: 'packages/nextjs/app/page.tsx',
      description: 'Main Page (should be updated)',
      required: true,
    },
    {
      path: 'packages/nextjs/package.json',
      description: 'Package.json (should have new deps)',
      required: true,
    },
  ];
  
  const results = {
    exists: 0,
    missing: 0,
    empty: 0,
  };
  
  files.forEach(file => {
    const result = checkFile(file.path, file.description);
    results[result]++;
  });
  
  log('\n' + '='.repeat(60), 'cyan');
  log('Summary:', 'cyan');
  log('='.repeat(60), 'cyan');
  log(`✅ Files exist: ${results.exists}`, 'green');
  log(`❌ Files missing: ${results.missing}`, 'red');
  log(`⚠️  Files empty: ${results.empty}`, 'yellow');
  
  if (results.missing > 0 || results.empty > 0) {
    log('\n❌ Build incomplete. Continue running prompts.', 'red');
    process.exit(1);
  } else {
    log('\n✅ All files generated! Ready for next steps:', 'green');
    log('\n1. cd packages/nextjs && yarn install', 'cyan');
    log('2. Edit .env.local and add ANTHROPIC_API_KEY', 'cyan');
    log('3. yarn start', 'cyan');
    process.exit(0);
  }
}

main();
