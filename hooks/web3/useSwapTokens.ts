"use client";
import { useCallback, useState } from "react";
import { WalletState } from "@web3-onboard/core";
import {
  getPoolContract,
  checkSufficientTokenApproval,
  approveERC20Token,
} from "@/utils/helpers/web3-api";
import { unformatValue } from "@/utils/helpers/web3";
import { CommonState } from "@/utils/helpers/types";

export type UseSwapTokensProps = {
  swap: (
    wallet: WalletState,
    pairAddress: string,
    user: string,
    tokenInAddress: string,
    tokenInAmount: number
  ) => Promise<string>;
  swapTransactionState: SwapTransactionState;
  resetSwapTransactionState: () => void;
};

export type SwapTransactionState = {
  approveSwapInToken: CommonState;
  swap: CommonState;
};

const DEFAULT_SWAP_TX_STATE: SwapTransactionState = {
  approveSwapInToken: CommonState.LOADING,
  swap: CommonState.LOADING,
};

function useSwapTokens(): UseSwapTokensProps {
  const [swapTransactionState, setSwapTransactionState] =
    useState<SwapTransactionState>(DEFAULT_SWAP_TX_STATE);

  const swap = useCallback(
    async (
      wallet: WalletState,
      pairAddress: string,
      user: string,
      tokenInAddress: string,
      tokenInAmount: number
    ): Promise<string> => {
      const contract = await getPoolContract(pairAddress, wallet!);
      const formattedTokenInAmount = unformatValue(tokenInAmount, 18);

      try {
        if (
          !(await checkSufficientTokenApproval(
            pairAddress,
            user,
            pairAddress,
            formattedTokenInAmount
          ))
        ) {
          const approveTx = await approveERC20Token(
            wallet,
            tokenInAddress,
            pairAddress,
            formattedTokenInAmount
          );
          if (!approveTx) throw new Error();
        }
        setSwapTransactionState((prev) => ({
          ...prev,
          approveSwapInToken: CommonState.COMPLETED,
        }));

        const swapTx = await contract.swap(
          formattedTokenInAmount,
          tokenInAddress,
          user,
          "0x"
        );
        const swapTxReceipt = await swapTx.wait();
        console.log("See swap TX RECEIPT", swapTxReceipt);
        setSwapTransactionState((prev) => ({
          ...prev,
          swap: CommonState.COMPLETED,
        }));

        return swapTxReceipt.blockHash;
      } catch (error) {
        console.log("ERROR SWAPPING TOKENS", error);
        setSwapTransactionState(() => ({
          approveSwapInToken: CommonState.FAILED,
          swap: CommonState.FAILED,
        }));
        return "";
      }
    },
    []
  );

  const resetSwapTransactionState = useCallback(() => {
    setSwapTransactionState(() => DEFAULT_SWAP_TX_STATE);
  }, []);

  return { swap, swapTransactionState, resetSwapTransactionState };
}

export default useSwapTokens;
