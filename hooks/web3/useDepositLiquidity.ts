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
  depositLiquidity: (
    wallet: WalletState,
    user: string,
    pairAddress: string,
    token0Address: string,
    token0Amount: number,
    token1Address: string,
    token1Amount: number
  ) => Promise<string>;
  depositTransactionState: DepositTransactionState;
  refreshDepositTransactionState: () => void;
};

export type DepositTransactionState = {
  approveToken0: CommonState;
  approveToken1: CommonState;
  deposit: CommonState;
};

const DEFAULT_DEPOSIT_TX_STATE: DepositTransactionState = {
  approveToken0: CommonState.LOADING,
  approveToken1: CommonState.LOADING,
  deposit: CommonState.LOADING,
};

function useDepositLiquidity(): UseSwapTokensProps {
  const [depositTransactionState, setDepositTransactionState] =
    useState<DepositTransactionState>(DEFAULT_DEPOSIT_TX_STATE);

  const depositLiquidity = useCallback(
    async (
      wallet: WalletState,
      user: string,
      pairAddress: string,
      token0Address: string,
      token0Amount: number,
      token1Address: string,
      token1Amount: number
    ): Promise<string> => {
      const contract = await getPoolContract(pairAddress, wallet!);
      const formattedToken0Amount = unformatValue(token0Amount, 18);
      const formattedToken1Amount = unformatValue(token1Amount, 18);

      try {
        if (
          !(await checkSufficientTokenApproval(
            token0Address,
            user,
            pairAddress,
            formattedToken0Amount
          ))
        ) {
          const approveToken0Res = await approveERC20Token(
            wallet,
            token0Address,
            pairAddress,
            formattedToken0Amount
          );
          if (!approveToken0Res) throw new Error();
        }
        setDepositTransactionState((prev) => ({
          ...prev,
          approveToken0: CommonState.COMPLETED,
        }));

        if (
          !(await checkSufficientTokenApproval(
            token1Address,
            user,
            pairAddress,
            formattedToken1Amount
          ))
        ) {
          const approveToken1Res = await approveERC20Token(
            wallet,
            token1Address,
            pairAddress,
            formattedToken1Amount
          );
          if (!approveToken1Res) throw new Error();
        }
        setDepositTransactionState((prev) => ({
          ...prev,
          approveToken1: CommonState.COMPLETED,
        }));

        console.log(
          "SEE DEPOSIT PARAMS",
          user,
          formattedToken0Amount,
          formattedToken1Amount
        );
        // Simulate the call without actually executing it
        const depositTx = await contract.deposit(
          user,
          formattedToken0Amount,
          formattedToken1Amount
        );
        const depositTxReceipt = await depositTx.wait();
        console.log("DEPOSIT TX", depositTxReceipt.blockHash);
        setDepositTransactionState((prev) => ({
          ...prev,
          deposit: CommonState.COMPLETED,
        }));
        return depositTxReceipt.blockHash;
      } catch (error) {
        console.log("ERROR DEPOSITING LIQUIDITY:", error);

        return "";
      }
    },
    []
  );

  const refreshDepositTransactionState = useCallback(() => {
    setDepositTransactionState(() => DEFAULT_DEPOSIT_TX_STATE);
  }, []);

  return {
    depositLiquidity,
    depositTransactionState,
    refreshDepositTransactionState,
  };
}

export default useDepositLiquidity;
