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
  [mainnet, goerli, polygon, polygonMumbai, avalanche, avalancheFuji],
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
