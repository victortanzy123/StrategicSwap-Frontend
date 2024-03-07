import dayjs from "dayjs";
import { ethers } from "ethers";
import { ChainDetails } from "./types";
import ETHEREUM_LOGO from "public/logos/ethereum-logo.svg";

/* ==================================================
                  PROTOCOL CONFIGS
=====================================================*/
export const GOERLI_RPC_NODE: string = `https://goerli.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`;
export const SEPOLIA_RPC_NODE: string = `https://rpc.sepolia.org`;

export const STRATEGIC_SWAP_POOL_FACTORY_ADDRESS: string =
  process.env.NEXT_PUBLIC_POOL_FACTORY_ADDRESS!;

export const NULL_ADDRESS: string =
  "0x0000000000000000000000000000000000000000";

export const ONE_HOUR = dayjs().hour();

export const ONE_DAY = dayjs().day();

export const ONE_WEEK = dayjs().day() * 7;

export const ONE_YEAR = dayjs().year();

export const DOTS = "...";

export const DEFAULT_DECIMALS: number = 18;

export const GOERLI_TESTNET_CHAIN_CONFIG: ChainDetails = {
  id: 5,
  hexId: "0x5",
  currencyCode: "gETH",
  decimals: 18,
  logoPath: ETHEREUM_LOGO as string,
  subgraphChainCode: "goerli",
  chain: "GOERLI TESTNET",
  chainCode: "GOERLI",
  factory: STRATEGIC_SWAP_POOL_FACTORY_ADDRESS,
  rpcNode: GOERLI_RPC_NODE,
  explorerLinkPrefix: `https://goerli.etherscan.io/`,
};

export const SEPOLIA_TESTNET_CHAIN_CONFIG: ChainDetails = {
  id: 11155111,
  hexId: "0xaa36a7",
  currencyCode: "sETH",
  decimals: 18,
  logoPath: ETHEREUM_LOGO as string,
  subgraphChainCode: "sepolia",
  chain: "SEPOLIA TESTNET",
  chainCode: "SEPOLIA",
  factory: STRATEGIC_SWAP_POOL_FACTORY_ADDRESS,
  rpcNode: SEPOLIA_RPC_NODE,
  explorerLinkPrefix: `https://sepolia.etherscan.io/`,
};

export const DEFAULT_CHAIN_DETAILS: ChainDetails = SEPOLIA_TESTNET_CHAIN_CONFIG;

/* ==================================================
            MISC WEB3-RELATED HELPERS
=====================================================*/
export function getExplorer(address: string, label: string) {
  return `${GOERLI_TESTNET_CHAIN_CONFIG.explorerLinkPrefix}${label}/${address}`;
}

export function isAddress(input: string) {
  return ethers.isAddress(input);
}

export function truncateAddress(
  address: string | null,
  signerAddress: string | null = null
) {
  if (!address) return "No Account";
  if (address === NULL_ADDRESS) return "Null Address";
  if (signerAddress && signerAddress.toLowerCase() === address.toLowerCase())
    return "You";
  const match = address.match(
    /^(0x[a-zA-Z0-9]{3})[a-zA-Z0-9]+([a-zA-Z0-9]{5})$/
  );
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
}

export function unformatValue(
  formattedValue: number | string,
  decimals: number
): string {
  formattedValue =
    typeof formattedValue === "number"
      ? formattedValue.toString()
      : formattedValue;

  console.log(
    "SEE UNFORMATTED AMOUNT:",
    ethers.parseUnits(formattedValue, decimals).toString()
  );
  return ethers.parseUnits(formattedValue, decimals).toString();
}

export function formatValue(
  unformattedValue: number | string,
  decimals: number
): string {
  unformattedValue =
    typeof unformattedValue === "number"
      ? unformattedValue.toString()
      : unformattedValue;
  return ethers.formatUnits(unformattedValue, decimals);
}
