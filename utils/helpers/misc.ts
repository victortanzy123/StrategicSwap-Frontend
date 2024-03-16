import { WalletState } from "@web3-onboard/core";
import { NULL_ADDRESS } from "../constants";
import { UserTokensState } from "./types";

const dayjs = require("dayjs");

import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime, {
  rounding: Math.floor,
});


export const DEFAULT_DECIMALS_PRECISION: number = 4;
export const DISPLAY_USD_DECIMALS: number = 2;

export function processUserTokenStates(
  tokens: string[],
  balances: string[]
): UserTokensState | null {
  if (tokens.length !== balances.length) return null;

  const res = {
    token0: {
      address: tokens[0],
      balance: balances[0],
    },
    token1: {
      address: tokens[1],
      balance: balances[1],
    },
    lpToken: {
      address: tokens[2],
      balance: balances[2],
    },
  };
  return res;
}

export function getWalletAddress(
  wallet: WalletState,
  truncate: boolean = false
) {
  const address = wallet.accounts[0]?.address;
  return truncate ? truncateAddress(address) : address;
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
    /^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{3})$/
  );
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
}

export function numberCheck(input: string): boolean {
  return /^\d+\.\d+$/.test(input) || /^\d+$/.test(input) || input.length === 0;
}

// Time Related Functions
export function getDurationAgo(timestamp: number): string {
  // Convert the Unix timestamp to a Day.js instance
  const timestampDate = dayjs.unix(timestamp);
  // Get the "how many days ago" format
  return timestampDate.fromNow();
}

export function getMonthYearString(
  timestamp: number,
  smallMode: boolean = false
): string {
  if (timestamp === 0) return "NOT JOINED";

  const timestampDate = dayjs.unix(timestamp);
  return timestampDate.format("MMM YYYY");
}


export function truncateHexString(input: string): string {
  return `${input.slice(0, 4)}...${input.slice(-3)}`;
}

export function validateSufficientBalance(
  specified: number,
  owned: number
): boolean {
  return specified <= owned;
}
