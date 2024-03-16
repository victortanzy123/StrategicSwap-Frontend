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
  withdrawLiquidity: (
    wallet: WalletState,
    pairAddress: string,
    user: string,
    amount: number
  ) => Promise<string>;
  withdrawTransactionState: WithdrawTransactionState;
  refreshWithdrawTransactionState: () => void;
};

export type WithdrawTransactionState = {
  approveLpToken: CommonState;
  withdraw: CommonState;
};

const DEFAULT_WITHDRAW_TX_STATE: WithdrawTransactionState = {
  approveLpToken: CommonState.LOADING,
  withdraw: CommonState.LOADING,
};

function useWithdrawLiquidity(): UseSwapTokensProps {
  const [withdrawTransactionState, setWithdrawTransactionState] =
    useState<WithdrawTransactionState>(DEFAULT_WITHDRAW_TX_STATE);

  const withdrawLiquidity = useCallback(
    async (
      wallet: WalletState,
      pairAddress: string,
      user: string,
      amount: number
    ): Promise<string> => {
      const contract = await getPoolContract(pairAddress, wallet!);

      const formattedAmount = unformatValue(amount, 18);
      try {
        if (
          !(await checkSufficientTokenApproval(
            pairAddress,
            user,
            pairAddress,
            formattedAmount
          ))
        ) {
          const approveTx = await approveERC20Token(
            wallet,
            pairAddress,
            pairAddress,
            formattedAmount
          );
          if (!approveTx) {
            setWithdrawTransactionState((prev) => ({
              ...prev,
              approveLpToken: CommonState.FAILED,
            }));

            throw new Error();
          }
        }
        setWithdrawTransactionState((prev) => ({
          ...prev,
          approveLpToken: CommonState.COMPLETED,
        }));

        const withdrawTx = await contract.withdraw(user, formattedAmount);
        const withdrawTxReceipt = await withdrawTx.wait();

        setWithdrawTransactionState((prev) => ({
          ...prev,
          withdraw: CommonState.COMPLETED,
        }));

        return withdrawTxReceipt.blockHash;
      } catch (error) {
        console.log("ERROR WITHDRAWING LIQUIDITY", error);
        return "";
      }
    },
    []
  );

  const refreshWithdrawTransactionState = useCallback(() => {
    setWithdrawTransactionState(() => DEFAULT_WITHDRAW_TX_STATE);
  }, []);

  return {
    withdrawLiquidity,
    withdrawTransactionState,
    refreshWithdrawTransactionState,
  };
}

export default useWithdrawLiquidity;
