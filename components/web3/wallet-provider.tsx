"use client";

import { Web3OnboardProvider, init } from "@web3-onboard/react";
import injectedModule from "@web3-onboard/injected-wallets";

const INFURA_KEY = process.env.INFURA_API_KEY;

const ethereumGoerli = {
  id: "0x5",
  token: "ETH",
  label: "Goerli",
  rpcUrl: `https://goerli.infura.io/v3/${INFURA_KEY}`,
};

const mantle = {
  id: "0x1389",
  token: "MNT",
  label: "Mantle Testnet",
  rpcUrl: "https://rpc.testnet.mantle.xyz/",
};

const linea = {
  id: "0xe704",
  token: "ETH",
  label: "Linea",
  rpcUrl: `https://linea-goerli.infura.io/v3/${INFURA_KEY}`,
};

const chains = [ethereumGoerli, mantle, linea];
const wallets = [injectedModule()];

const web3Onboard = init({
  wallets,
  chains,
  appMetadata: {
    name: "Strategic Swap",
    icon: "<svg>App Icon</svg>",
    description: "The better Decentralised Exchange.",
  },
  theme: "dark",
  i18n: {
    en: {
      connect: {
        selectingWallet: {
          header: "Select wallet to connect.",
          sidebar: {
            heading: "Hello",
            subheading: "Welcome to StrategicSwap!",
            paragraph:
              "Connecting your digital wallet enables you to swap tokens or earn yields from liquidity provision.",
          },
        },
      },
    },
  },
  connect: {
    autoConnectLastWallet: true,
  },
});

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Web3OnboardProvider web3Onboard={web3Onboard}>
      {children}
    </Web3OnboardProvider>
  );
};
