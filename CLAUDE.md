# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Scaffold-ETH 2 is a toolkit for building decentralized applications (dapps) on Ethereum. Built with NextJS (App Router), RainbowKit, Wagmi, Viem, and TypeScript. Supports both Hardhat and Foundry.

**Yarn monorepo** with two main packages:
- `packages/hardhat`: Solidity framework for writing, testing, and deploying smart contracts
- `packages/nextjs`: NextJS frontend with custom hooks and components for smart contract interaction

## Common Commands

### Development Workflow
```bash
# Start local blockchain (terminal 1)
yarn chain

# Deploy contracts to local network (terminal 2)
yarn deploy

# Start Next.js frontend (terminal 3)
yarn start
```

### Testing & Quality
```bash
# Run contract tests
yarn test
# Or from hardhat package
yarn hardhat:test

# Run tests with gas reporting
REPORT_GAS=true yarn hardhat:test

# Type checking
yarn hardhat:check-types  # Check hardhat types
yarn next:check-types     # Check frontend types

# Linting & formatting
yarn lint                 # Lint both packages
yarn format              # Format all code
yarn hardhat:lint        # Lint hardhat only
yarn next:lint           # Lint Next.js only
```

### Contract Development
```bash
# Compile contracts
yarn compile

# Deploy to specific network
yarn deploy --network sepolia

# Verify contract on Etherscan
yarn verify --network sepolia

# Clean build artifacts
yarn hardhat:clean

# Flatten contracts for verification
yarn hardhat:flatten

# Fork mainnet for testing
yarn fork
```

### Account Management
```bash
# Generate new deployer account
yarn generate

# Import existing private key
yarn account:import

# View account details
yarn account

# Reveal private key (use with caution)
yarn account:reveal-pk
```

### Deployment
```bash
# Deploy frontend to Vercel
yarn vercel

# Deploy to IPFS
yarn ipfs

# Build production frontend
yarn next:build
```

## Architecture

### Smart Contract Flow

1. **Contracts**: Write Solidity contracts in `packages/hardhat/contracts/`
2. **Deployment**: Create deployment scripts in `packages/hardhat/deploy/` using hardhat-deploy plugin
3. **Auto-generation**: On deployment, TypeScript ABIs are automatically generated via `generateTsAbis` script
4. **Frontend sync**: Generated ABIs populate `packages/nextjs/contracts/deployedContracts.ts` for type-safe frontend access

### Frontend Architecture

The Next.js app uses **App Router** (not Pages Router). Key directories:
- `app/`: Next.js 15 App Router pages and layouts
- `components/`: Reusable React components
- `hooks/scaffold-eth/`: Custom hooks wrapping Wagmi for contract interaction
- `contracts/`: Auto-generated contract ABIs and types
- `utils/scaffold-eth/`: Utility functions for contract data, parsing, etc.

### Contract Interaction Pattern

**Critical**: Always use Scaffold-ETH hooks for contract interaction. Never use raw Wagmi hooks directly.

#### Reading Contract Data
```typescript
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const { data } = useScaffoldReadContract({
  contractName: "YourContract",
  functionName: "functionName",
  args: [arg1, arg2], // optional
});
```

#### Writing to Contracts
```typescript
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const { writeContractAsync } = useScaffoldWriteContract({
  contractName: "YourContract",
});

// Later, in a handler:
await writeContractAsync({
  functionName: "setGreeting",
  args: ["Hello World"],
  value: parseEther("0.1"), // optional, for payable functions
});
```

#### Reading Events
```typescript
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

const { data: events, isLoading, error } = useScaffoldEventHistory({
  contractName: "YourContract",
  eventName: "GreetingChange",
  watch: true, // optional - listen for new events
});

// Access event args:
events?.map((event) => event.args.greetingSetter)
```

### UI Components

Always use Scaffold-ETH components for Ethereum-specific UI:
- `<Address>`: Display Ethereum addresses with ENS resolution
- `<AddressInput>`: Input field for Ethereum addresses
- `<Balance>`: Show ETH/token balance for an address
- `<EtherInput>`: Input with ETH/USD conversion

Located in `packages/nextjs/components/scaffold-eth/`

### Configuration

**Frontend config**: `packages/nextjs/scaffold.config.ts`
- `targetNetworks`: Array of chains the dapp supports
- `pollingInterval`: RPC polling frequency (ms)
- `alchemyApiKey`: Alchemy API key for RPC
- `rpcOverrides`: Custom RPC URLs per chain ID
- `walletConnectProjectId`: WalletConnect project ID
- `onlyLocalBurnerWallet`: Show burner wallet only on local network

**Hardhat config**: `packages/hardhat/hardhat.config.ts`
- Solidity compiler version and optimizer settings
- Network configurations (mainnet, testnets, L2s)
- Deployer account private key (from env or defaults to hardhat account 0)
- Etherscan API key for verification

### Contract Data Files

- `packages/nextjs/contracts/deployedContracts.ts`: Auto-generated from deployed contracts
- `packages/nextjs/contracts/externalContracts.ts`: Manually add external contract ABIs here

Both files power the Scaffold-ETH hooks with TypeScript autocompletion.

### Important Hooks (All in `packages/nextjs/hooks/scaffold-eth/`)
- `useScaffoldReadContract`: Read contract state
- `useScaffoldWriteContract`: Write transactions
- `useScaffoldEventHistory`: Query past events
- `useScaffoldWatchContractEvent`: Watch for new events
- `useDeployedContractInfo`: Get deployed contract info
- `useScaffoldContract`: Get contract instance
- `useTargetNetwork`: Get current target network
- `useTransactor`: Wrap transactions with notifications

## Development Notes

- **Hot reload**: Frontend auto-updates when contracts change (after `yarn deploy`)
- **Default network**: Hardhat config defaults to `localhost`
- **Burner wallet**: Automatically available on local network for quick testing
- **Debug UI**: Visit `/debug` to interact with contracts via auto-generated UI
- **Block explorer**: Built-in block explorer at `/blockexplorer` for local development
- **Node version**: Requires Node >= v20.18.3
- **Package manager**: Uses Yarn v3.2.3 (configured via `packageManager` field)

## Testing

Tests located in `packages/hardhat/test/`. Uses Hardhat testing framework with Chai matchers.

Run a single test file:
```bash
yarn workspace @se-2/hardhat test test/YourContract.ts
```

## Network Deployment

1. Set environment variables (`.env` in hardhat package):
   - `__RUNTIME_DEPLOYER_PRIVATE_KEY`: Deployer private key
   - `ALCHEMY_API_KEY`: Alchemy API key
   - `ETHERSCAN_V2_API_KEY`: For contract verification

2. Deploy to network:
```bash
yarn deploy --network sepolia
```

3. Update frontend config (`scaffold.config.ts`) to target the deployed network

4. Verify contract:
```bash
yarn verify --network sepolia
```
