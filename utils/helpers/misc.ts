import { WalletState } from "@web3-onboard/core";
import { NULL_ADDRESS } from "../constants";

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
