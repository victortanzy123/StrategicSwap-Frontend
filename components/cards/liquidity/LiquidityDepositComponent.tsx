import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import {
  Text,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Flex,
  Divider,
  Button,
  Skeleton,
  CircularProgress,
} from "@chakra-ui/react";
import { WalletState } from "@web3-onboard/core";

// Components
import PercentageButtonsGroup from "@/components/common/buttons/PercentageButtonsGroup";
import {
  DepositLiquidityState,
  StrategicPairDetails,
  UserTokensState,
} from "@/utils/helpers/types";
import { calcCorTokenDepositAmount } from "@/utils/helpers/math";
import {
  depositLiquidity,
  previewLpTokenAmountUponLP,
} from "@/utils/helpers/web3-api";
import { DEFAULT_DECIMALS_PRECISION } from "@/utils/helpers/misc";
import useDisclosure from "@/hooks/common/useDisclosure";
import useDepositLiquidity from "@/hooks/web3/useDepositLiquidity";
import LiquidityDepositModal from "@/components/common/modals/LiquidityDepositModal";

type LiquidityDepositComponentProps = {
  pair: StrategicPairDetails;
  pairAddress: string;
  user: string | null;
  wallet: WalletState | null;
  userTokenBalancesState: UserTokensState | null;
  refreshUserTokenBalances: () => void;
};

const DEFAULT_DEPOSIT_STATE: DepositLiquidityState = {
  token0Amount: 0,
  token1Amount: 0,
};
function LiquidityDepositComponent({
  pair,
  pairAddress,
  user,
  wallet,
  userTokenBalancesState,
  refreshUserTokenBalances,
}: LiquidityDepositComponentProps) {
  const { isOpen, onOpen, onToggle } = useDisclosure();
  const {
    depositLiquidity,
    depositTransactionState,
    refreshDepositTransactionState,
  } = useDepositLiquidity();

  const [loading, setIsLoading] = useState<boolean>(false);
  const [isDepositing, setIsDepositing] = useState<boolean>(false);
  const [lpTokenOut, setLpTokenOut] = useState<number>(0);
  const [depositState, setDepositState] = useState<DepositLiquidityState>(
    DEFAULT_DEPOSIT_STATE
  );

  function getPreviewLpTokenAmountOut() {
    if (
      pair &&
      user &&
      (depositState.token0Amount > 0 || depositState.token1Amount > 0)
    ) {
      setIsLoading(() => true);
      setLpTokenOut(() =>
        previewLpTokenAmountUponLP(
          depositState.token0Amount,
          depositState.token1Amount,
          pair.reserve0,
          pair.reserve1,
          pair.totalLpSupply
        )
      );
      setIsLoading(() => false);
    }
  }

  useEffect(() => {
    getPreviewLpTokenAmountOut();
  }, [depositState]);

  const getAmountByPercentage = useCallback(
    (percentageValue: number, tokenIndex: 0 | 1) => {
      const token =
        tokenIndex === 0
          ? userTokenBalancesState?.token0!
          : userTokenBalancesState?.token1!;
      const amount = ((token.balance as number) * percentageValue) / 100;
      setDepositState(() =>
        calcCorTokenDepositAmount(
          tokenIndex,
          amount,
          pair.reserve0,
          pair.reserve1
        )
      );
    },
    []
  );

  const tokenDepositPercentageCallback = (tokenIndex: 0 | 1) => {
    return (percentageValue: number) => {
      const token =
        tokenIndex === 0
          ? userTokenBalancesState?.token0!
          : userTokenBalancesState?.token1!;
      const amount = ((token.balance as number) * percentageValue) / 100;
      setDepositState(() =>
        calcCorTokenDepositAmount(
          tokenIndex,
          amount,
          pair.reserve0,
          pair.reserve1
        )
      );
    };
  };

  const depositHandler = async () => {
    if (!!!wallet || !!!user) return;

    onOpen(); // Open Deposit Liquidity modal
    setIsDepositing(() => true);
    const depositTxHash = await depositLiquidity(
      wallet!,
      user!,
      pairAddress,
      pair.token0.address,
      depositState.token0Amount,
      pair.token1.address,
      depositState.token1Amount
    );
    console.log("DEPOSIT TX WIF STATE:", depositTxHash, depositState, wallet);
    setIsDepositing(() => false);

    setIsLoading(() => true);
    await refreshUserTokenBalances();
    setDepositState(() => DEFAULT_DEPOSIT_STATE);
    setIsLoading(() => false);
  };
  const token0ValueChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setDepositState(() => {
      const amount = parseFloat(event.target.value) as number;
      return calcCorTokenDepositAmount(0, amount, pair.reserve0, pair.reserve1);
    });
  };
  const token1ValueChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setDepositState(() => {
      const amount = parseFloat(event.target.value) as number;
      return calcCorTokenDepositAmount(1, amount, pair.reserve0, pair.reserve1);
    });
  };

  const toggleOpen = useCallback(() => {
    refreshDepositTransactionState();
    onToggle();
  }, []);
  return (
    <>
      <LiquidityDepositModal
        isOpen={isOpen}
        toggleOpen={toggleOpen}
        data={pair}
        depositTransactionState={depositTransactionState}
        depositState={depositState}
      />
      <FormControl mt={"2rem"} mb={"1rem"}>
        <FormLabel
          textTransform={"uppercase"}
          letterSpacing={"0.1em"}
          fontWeight={"300"}
        >
          Amount In ({pair.token0.name})
        </FormLabel>
        <Input
          type="number"
          isDisabled={loading || isDepositing}
          value={depositState.token0Amount}
          onChange={token0ValueChangeHandler}
        />
        <Flex mt={"0.5rem"} justifyContent={"space-between"}>
          <Skeleton isLoaded={!loading} minWidth={"8rem"} height={"1.8rem"}>
            <FormHelperText>
              Balance: {userTokenBalancesState?.token0.balance ?? 0}
            </FormHelperText>
          </Skeleton>
          <PercentageButtonsGroup
            callback={tokenDepositPercentageCallback(0)}
          />
        </Flex>
      </FormControl>
      <FormControl mb={"1rem"}>
        <FormLabel
          textTransform={"uppercase"}
          letterSpacing={"0.1em"}
          fontWeight={"300"}
        >
          Amount In ({pair.token1.name})
        </FormLabel>
        <Input
          type="number"
          isDisabled={loading || isDepositing}
          value={depositState.token1Amount.toFixed(DEFAULT_DECIMALS_PRECISION)}
          onChange={token1ValueChangeHandler}
        />
        <Flex mt={"0.5rem"} justifyContent={"space-between"}>
          <Skeleton isLoaded={!loading} minWidth={"8rem"} height={"1.8rem"}>
            <FormHelperText>
              Balance: {userTokenBalancesState?.token1.balance ?? 0}
            </FormHelperText>
          </Skeleton>
          <PercentageButtonsGroup
            callback={tokenDepositPercentageCallback(1)}
          />
        </Flex>
      </FormControl>
      <Flex justifyContent={"space-between"}>
        <Text
          textTransform={"uppercase"}
          letterSpacing={"0.1em"}
          fontWeight={"300"}
        >
          You will Receive
        </Text>
        <Text
          textTransform={"uppercase"}
          letterSpacing={"0.1em"}
          fontWeight={"300"}
        >
          <Text fontWeight={"bold"}>
            {lpTokenOut.toFixed(DEFAULT_DECIMALS_PRECISION)}
          </Text>{" "}
          LP TOKEN
        </Text>
      </Flex>
      <Divider my={"2rem"} width={"full"} />
      <Button
        width={"full"}
        size={"2xl"}
        height={"3rem"}
        textTransform={"uppercase"}
        letterSpacing={"0.1em"}
        fontWeight={"300"}
        isLoading={isDepositing}
        isDisabled={loading}
        onClick={depositHandler}
      >
        PROVIDE LIQUIDITY
      </Button>
    </>
  );
}

export default LiquidityDepositComponent;
