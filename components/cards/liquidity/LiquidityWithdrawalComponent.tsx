import React, { ChangeEvent, useCallback, useState } from "react";
import {
  Text,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Flex,
  Divider,
  Button,
  Box,
  Skeleton,
} from "@chakra-ui/react";
import { WalletState } from "@web3-onboard/core";

// Hooks
import useWithdrawLiquidity from "@/hooks/web3/useWithdrawLiquidity";

// Components
import PercentageButtonsGroup from "@/components/common/buttons/PercentageButtonsGroup";
import {
  StrategicPairDetails,
  UserTokensState,
  WithdrawLiquidityState,
} from "@/utils/helpers/types";
import {
  DEFAULT_DECIMALS_PRECISION,
  DISPLAY_USD_DECIMALS,
} from "@/utils/helpers/misc";
import {
  calcTokensOutputFromLpTokenAmount,
  safeDiv,
} from "@/utils/helpers/math";
import LiquidityWithdrawModal from "@/components/common/modals/LiquidityWithdrawModal";
import useDisclosure from "@/hooks/common/useDisclosure";
// import { withdrawLiquidity } from "@/utils/helpers/web3-api";

type LiquidityWithdrawalComponentProps = {
  pair: StrategicPairDetails;
  pairAddress: string;
  user: string | null;
  wallet: WalletState | null;
  userTokenBalancesState: UserTokensState | null;
  refreshUserTokenBalances: () => void;
};

const DEFAULT_WITHDRAWAL_STATE: WithdrawLiquidityState = {
  lpTokenToWithdraw: 0,
  token0Redeemable: 0,
  token1Redeemable: 0,
};
function LiquidityWithdrawalComponent({
  pair,
  pairAddress,
  user,
  wallet,
  userTokenBalancesState,
  refreshUserTokenBalances,
}: LiquidityWithdrawalComponentProps) {
  const { isOpen, onOpen, onToggle } = useDisclosure();
  const { withdrawLiquidity, withdrawTransactionState } =
    useWithdrawLiquidity();

  const [loading, setIsLoading] = useState<boolean>(false);
  const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);
  const [withdrawalState, setWithdrawalState] =
    useState<WithdrawLiquidityState>(DEFAULT_WITHDRAWAL_STATE);

  const getAmountByPercentage = useCallback((percentageValue: number) => {
    const lpAmount = safeDiv(
      (userTokenBalancesState?.lpToken.balance as number) * percentageValue,
      100
    );
    const { token0Amount, token1Amount } = calcTokensOutputFromLpTokenAmount(
      lpAmount,
      pair.totalLpSupply,
      pair.reserve0,
      pair.reserve1
    );
    setWithdrawalState((prev) => ({
      ...prev,
      token0Redeemable: token0Amount,
      token1Redeemable: token1Amount,
    }));
  }, []);

  const withdrawHandler = async () => {
    if (!!!wallet || !!!user) return;

    onOpen(); // Open modal
    setIsWithdrawing(() => true);
    const withdrawTxHash = await withdrawLiquidity(
      wallet!,
      pairAddress,
      user!,
      withdrawalState.lpTokenToWithdraw
    );
    console.log("WITHDRAW TX:", withdrawTxHash);
    setIsWithdrawing(() => false);

    setIsLoading(() => true);
    await refreshUserTokenBalances();
    setWithdrawalState(() => DEFAULT_WITHDRAWAL_STATE);
    setIsLoading(() => false);
  };

  const valueChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setWithdrawalState(() => {
      const lpAmount = parseFloat(event.target.value) as number;
      const { token0Amount, token1Amount } = calcTokensOutputFromLpTokenAmount(
        lpAmount,
        pair.totalLpSupply,
        pair.reserve0,
        pair.reserve1
      );

      return {
        lpTokenToWithdraw: parseFloat(event.target.value) as number,
        token0Redeemable: token0Amount,
        token1Redeemable: token1Amount,
      };
    });
  };
  console.log("SEE WITHDRAWAL STATE", withdrawalState);
  return (
    <>
      <LiquidityWithdrawModal
        isOpen={isOpen}
        toggleOpen={onToggle}
        data={pair}
        withdrawTransactionState={withdrawTransactionState}
        withdrawalState={withdrawalState}
      />
      <FormControl mt={"2rem"} mb={"1rem"}>
        <FormLabel
          textTransform={"uppercase"}
          letterSpacing={"0.1em"}
          fontWeight={"300"}
        >
          Amount In (LP Token)
        </FormLabel>
        <Input
          type="number"
          isDisabled={loading || isWithdrawing}
          value={withdrawalState.lpTokenToWithdraw}
          onChange={valueChangeHandler}
        />
        <Flex mt={"0.5rem"} justifyContent={"space-between"}>
          <Skeleton isLoaded={!loading} minWidth={"8rem"} height={"1.8rem"}>
            <FormHelperText>
              Balance: {userTokenBalancesState?.lpToken?.balance ?? 0}
            </FormHelperText>
          </Skeleton>
          <PercentageButtonsGroup callback={getAmountByPercentage} />
        </Flex>
      </FormControl>
      <Flex width={"full"} justifyContent={"space-between"}>
        <Text
          textTransform={"uppercase"}
          letterSpacing={"0.1em"}
          fontWeight={"300"}
        >
          YOU WILL RECEIVE
        </Text>
        <Box>
          <Text
            textTransform={"uppercase"}
            letterSpacing={"0.1em"}
            fontWeight={"300"}
            display={"flex"}
          >
            <Text fontWeight={"bold"} mr={"0.5rem"}>
              {withdrawalState.token0Redeemable.toFixed(
                DEFAULT_DECIMALS_PRECISION
              )}{" "}
            </Text>{" "}
            {pair.token0.name}
          </Text>
          <Text
            textTransform={"uppercase"}
            letterSpacing={"0.1em"}
            fontWeight={"300"}
            display={"flex"}
          >
            <Text fontWeight={"bold"} mr={"0.5rem"}>
              {withdrawalState.token1Redeemable.toFixed(
                DEFAULT_DECIMALS_PRECISION
              )}{" "}
            </Text>{" "}
            {pair.token1.name}
          </Text>

          {/* <Text
            textTransform={"uppercase"}
            letterSpacing={"0.1em"}
            fontWeight={"300"}
          >
            {withdrawalState.token1Redeemable.toFixed(
              DEFAULT_DECIMALS_PRECISION
            )}{" "}
            {pair.token1.name}
          </Text> */}
        </Box>
      </Flex>
      <Divider my={"2rem"} width={"full"} />
      <Button
        width={"full"}
        size={"2xl"}
        height={"3rem"}
        textTransform={"uppercase"}
        letterSpacing={"0.1em"}
        fontWeight={"300"}
        isLoading={isWithdrawing}
        isDisabled={loading}
        onClick={withdrawHandler}
      >
        WITHDRAW LIQUIDITY
      </Button>
    </>
  );
}

export default LiquidityWithdrawalComponent;
