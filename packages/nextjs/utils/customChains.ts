import { defineChain } from "viem";

export const flowMainnet = defineChain({
  id: 747,
  name: "Flow EVM Mainnet",
  nativeCurrency: { name: "Flow", symbol: "FLOW", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://mainnet.evm.nodes.onflow.org"] },
  },
  blockExplorers: {
    default: { name: "Flowscan", url: "https://evm.flowscan.io" },
  },
});

export const flowTestnet = defineChain({
  id: 545,
  name: "Flow EVM Testnet",
  nativeCurrency: { name: "Flow", symbol: "FLOW", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet.evm.nodes.onflow.org"] },
  },
  blockExplorers: {
    default: { name: "Flowscan Testnet", url: "https://evm-testnet.flowscan.io" },
  },
  testnet: true,
});
