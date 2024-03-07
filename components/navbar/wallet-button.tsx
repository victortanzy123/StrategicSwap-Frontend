"use client";
import { getWalletAddress } from "@/utils/helpers/misc";
import { useConnectWallet } from "@web3-onboard/react";
import { memo } from "react";

function WalletButton() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  async function onClickHandler() {
    await (wallet ? disconnect(wallet) : connect());
  }
  return (
    <>
      <button
        data-dropdown-toggle="dropdown"
        disabled={connecting}
        onClick={onClickHandler}
        className={`w-fit absolute right-5 top-2 p-3 uppercase tracking-wider rounded-full hover:scale-110 active:scale-100 duration-200 bg-slate-200 dark:bg-[#212933]`}
      >
        {!!wallet ? getWalletAddress(wallet, true) : "Connect Wallet"}
      </button>
    </>
  );
}

export default memo(WalletButton);
