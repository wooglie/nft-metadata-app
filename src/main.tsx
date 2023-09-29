import React from "react";
import ReactDOM from "react-dom";
import * as ReactDOMClient from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";

import {
  mainnet,
  goerli,
  polygon,
  polygonMumbai,
  avalanche,
  avalancheFuji,
} from "@wagmi/core/chains";

import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { publicProvider } from "@wagmi/core/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import App from "./App";
import { WagmiConfig, configureChains, createClient } from "wagmi";

const { chains, provider } = configureChains(
  [mainnet, goerli, polygon, polygonMumbai, avalanche, avalancheFuji,
    {
      id: 13_337,
      name: 'Beam Testnet',
      network: 'Beam Testnet',
      nativeCurrency: {
        decimals: 18,
        name: 'Merit Circle',
        symbol: 'MC',
        logoUri:
          'https://images.ctfassets.net/gcj8jwzm6086/488HFZvUO1qpnYRA9PDHCo/5664b04bc1de6341ed7c480c79e1c8de/token-logo.png',
      },
      rpcUrls: {
        public: {
          http: ['https://subnets.avax.network/beam/testnet/rpc'],
        },
        default: {
          http: ['https://subnets.avax.network/beam/testnet/rpc'],
        },
      },
      blockExplorers: {
        default: {
          name: 'Explorer',
          url: 'https://subnets-test.avax.network/beam',
        },
      },
      contracts: {
        multicall3: {
          address: '0x9BF49b704EE2A095b95c1f2D4EB9010510c41C9E',
          blockCreated: 3,
        },
        weth: {
          address: '0xF65B6f9c94187276C7d91F4F74134751d248bFeA',
        },
        uniswapV2Router: {
          address: '0xB4cFBc4836c5a0Eb27A502B6008f9baF3Bf8b3Ee',
        },
      },
      testnet: true,
    },
    {
      id: 4337,
      name: 'Beam Mainnet',
      network: 'Beam',
      nativeCurrency: {
        decimals: 18,
        name: 'Merit Circle',
        symbol: 'MC',
        logoUri:
          'https://images.ctfassets.net/gcj8jwzm6086/488HFZvUO1qpnYRA9PDHCo/5664b04bc1de6341ed7c480c79e1c8de/token-logo.png',
      },
      rpcUrls: {
        public: {
          http: ['https://subnets.avax.network/beam/mainnet/rpc'],
        },
        default: {
          http: ['https://subnets.avax.network/beam/mainnet/rpc'],
        },
      },
      blockExplorers: {
        default: {
          name: 'Explorer',
          url: 'https://subnets.avax.network/beam',
        },
      },
      contracts: {
        multicall3: {
          address: '0x4956f15efdc3dc16645e90cc356eafa65ffc65ec',
          blockCreated: 3,
        },
        weth: {
          address: '0xD51BFa777609213A653a2CD067c9A0132a2D316A',
        },
        uniswapV2Router: {
          address: '0x965B104e250648d01d4B3b72BaC751Cde809D29E',
        },
      },
    }],
  [
    publicProvider({
      priority: 1,
      stallTimeout: 1_000,
    }),
    jsonRpcProvider({
      priority: 2,
      rpc: (chain) => {
        return { http: chain.rpcUrls.default.http[0] };
      },
    }),
  ]
);

const connectors = [
  new MetaMaskConnector({
    chains,
  }),
  new CoinbaseWalletConnector({
    chains,
    options: {
      appName: "NFT Metadata",
    },
  }),
];

const client = createClient({
  autoConnect: true,
  provider,
  connectors,
});

const container = document.getElementById("root");

if (container) {
  const root = ReactDOMClient.createRoot(container);

  root.render(
    <React.StrictMode>
      <ChakraProvider>
        <WagmiConfig client={client}>
          <App />
        </WagmiConfig>
      </ChakraProvider>
    </React.StrictMode>
  );
}
