"use client";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Text,
  CardFooter,
  Heading,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Button,
  Flex,
  Divider,
  Skeleton,
} from "@chakra-ui/react";
import { WalletState } from "@web3-onboard/core";
import {
  CommonState,
  StrategicPairDetails,
  TokenDetails,
  UserTokensState,
} from "@/utils/helpers/types";

// Components
import SwapIconSwitch from "./SwapIconSwitch";
import PercentageButtonsGroup from "@/components/common/buttons/PercentageButtonsGroup";
import { previewSwapAmountOut } from "@/utils/helpers/web3-api";
import { formatValue, unformatValue } from "@/utils/helpers/web3";
import {
  DISPLAY_USD_DECIMALS,
  validateSufficientBalance,
} from "@/utils/helpers/misc";
import SwapModal from "@/components/common/modals/SwapModal";
import useDisclosure from "@/hooks/common/useDisclosure";
import useSwapTokens from "@/hooks/web3/useSwapTokens";
import useDebouncer from "@/hooks/common/useDebouncer";

type SwapCardProps = {
  pairAddress: string;
  userAddress: string | null;
  wallet: WalletState | null;
  userTokenBalances: UserTokensState | null;
  refreshUserTokenBalances: () => void;
  data: StrategicPairDetails;
  connect: any;
};
export type SwapInState = {
  token: TokenDetails;
  tokenAmount: number;
  tokenIndex: 0 | 1;
};
function SwapCard({
  pairAddress,
  userAddress,
  wallet,
  userTokenBalances,
  refreshUserTokenBalances,
  data,
  connect,
}: SwapCardProps) {
  const { token0, token1 } = data;
  const headingText = `${token0?.name} - ${token1?.name} Exchange`;
  const DEFAULT_SWAP_IN_STATE: SwapInState = {
    token: token0,
    tokenAmount: 0,
    tokenIndex: 0,
  };

  const { isOpen, onOpen, onToggle } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [swapInState, setSwapInState] = useState<SwapInState>(
    DEFAULT_SWAP_IN_STATE
  );
  const [amountOut, setAmountOut] = useState<number>(0);
  const swapOutToken = swapInState.tokenIndex === 0 ? token1 : token0;

  const { swap, swapTransactionState, resetSwapTransactionState } =
    useSwapTokens();

  async function refreshUserSwapState() {
    setIsLoading(() => true);
    await refreshUserTokenBalances();
    setSwapInState(() => DEFAULT_SWAP_IN_STATE);
    setIsLoading(() => false);
  }

  const swapIconCallback = () => {
    setIsLoading(() => true);
    setSwapInState((prev) => {
      const swapInToken = prev.tokenIndex === 0 ? token1 : token0;
      const swapInTokenIndex = prev.tokenIndex === 0 ? 1 : 0;
      return {
        token: swapInToken,
        tokenAmount: 0,
        tokenIndex: swapInTokenIndex,
      };
    });
    setIsLoading(() => false);
  };

  async function getPreviewSwapAmountOut() {
    setIsLoading(() => true);
    const unformattedAmount = await previewSwapAmountOut(
      pairAddress,
      swapInState.token.address,
      unformatValue(swapInState.tokenAmount, swapInState.token.decimals)
    );

    const formattedAmount = formatValue(
      unformattedAmount,
      swapOutToken.decimals
    );
    setAmountOut(() => parseFloat(formattedAmount));
    setIsLoading(() => false);
  }

  const debouncedPreviewSwapAmountOut = useDebouncer({
    callback: getPreviewSwapAmountOut,
  });

  useEffect(() => {
    // if (swapInState.tokenAmount > 0) getPreviewSwapAmountOut();
    if (swapInState.tokenAmount > 0) debouncedPreviewSwapAmountOut();
  }, [swapInState.tokenAmount]);

  const token0UserState = userTokenBalances?.token0;
  const token1UserState = userTokenBalances?.token1;
  const swapOutTokenState =
    swapInState.tokenIndex === 0 ? token1UserState : token0UserState;

  function validatePreSwapState(
    state: SwapInState,
    ownedTokenState: UserTokensState | null
  ): boolean {
    if (ownedTokenState === null) return false;

    const swapInIndex = state.tokenIndex;
    const swapInTokenSpecifiedValue = state.tokenAmount;
    const ownedSwapInTokenBalance = parseFloat(
      swapInIndex === 0
        ? (ownedTokenState.token0.balance as string)
        : (ownedTokenState.token1.balance as string)
    );

    return validateSufficientBalance(
      swapInTokenSpecifiedValue,
      ownedSwapInTokenBalance
    );
  }

  const validatedPreSwapState = validatePreSwapState(
    swapInState,
    userTokenBalances
  );
  const connectedAndWrongInput = !!userAddress && !validatedPreSwapState;

  const swapInTokenBalance = parseFloat(
    (swapInState.tokenIndex === 0
      ? token0UserState?.balance
      : token1UserState?.balance) as string
  ).toFixed(DISPLAY_USD_DECIMALS);

  const getAmountByPercentage = useCallback(
    (percentageValue: number) => {
      const amountIn = (parseFloat(swapInTokenBalance) * percentageValue) / 100;
      setSwapInState((prev) => ({ ...prev, tokenAmount: amountIn }));
    },
    [swapInState.token.address]
  );

  const valueChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setSwapInState((prev) => ({
      ...prev,
      tokenAmount: parseFloat(event.target.value) as number,
    }));
  };

  const swapHandler = async () => {
    if (wallet === null) return connect();
    setIsSwapping(() => true);
    onOpen(); // Open Transaction Status Modal
    const txHash = await swap(
      wallet as WalletState,
      pairAddress,
      userAddress as string,
      swapInState.token.address,
      swapInState.tokenAmount
    );
    setIsSwapping(() => false);

    setIsLoading(() => true);
    await refreshUserSwapState();
    setIsLoading(() => false);
  };

  const toggleOpen = useCallback(() => {
    resetSwapTransactionState();
    onToggle();
  }, []);

  return (
    <>
      <SwapModal
        isOpen={isOpen}
        toggleOpen={toggleOpen}
        status={{ state: CommonState.COMPLETED, type: "APPROVE", hash: "" }}
        data={data}
        swapInToken={swapInState.token}
        swapOutToken={swapOutToken}
        swapTransactionState={swapTransactionState}
      />
      <Card height={"35rem"} borderRadius={"2rem"} bg={"gray.600"}>
        <CardHeader justifyContent={"center"}>
          <Heading
            size="xl"
            textAlign={"center"}
            textTransform={"uppercase"}
            letterSpacing={"0.1em"}
            fontWeight={"300"}
            textColor={"white"}
          >
            {headingText}
          </Heading>
        </CardHeader>
        <CardBody>
          <Text
            textAlign={"center"}
            textTransform={"uppercase"}
            letterSpacing={"0.1em"}
            fontSize={"xl"}
            textColor={"white"}
          >
            Swapping {swapInState.token.name} for {swapOutToken.name}
          </Text>
          <FormControl mb={"1rem"}>
            <FormLabel
              textTransform={"uppercase"}
              letterSpacing={"0.1em"}
              fontWeight={"300"}
              textColor={"white"}
            >
              Amount In ({swapInState.token.name})
            </FormLabel>
            <Input
              type="number"
              onChange={valueChangeHandler}
              value={swapInState.tokenAmount}
              isDisabled={isLoading || isSwapping}
              textColor={"white"}
              focusBorderColor={"white"}
            />
            <Flex mt={"0.5rem"} justifyContent={"space-between"}>
              <Skeleton isLoaded={!isLoading} minWidth={"8rem"}>
                <FormHelperText textColor={"white"}>
                  Balance: {swapInTokenBalance}
                </FormHelperText>
              </Skeleton>
              <PercentageButtonsGroup callback={getAmountByPercentage} />
            </Flex>
          </FormControl>
          <Flex width={"full"} justifyContent={"center"}>
            <SwapIconSwitch callback={swapIconCallback} />
          </Flex>
          <FormControl>
            <FormLabel
              textTransform={"uppercase"}
              letterSpacing={"0.1em"}
              fontWeight={"300"}
              textColor={"white"}
            >
              Receiving Amount ({swapOutToken.name})
            </FormLabel>
            <Input
              type="number"
              isDisabled
              value={amountOut}
              textColor={"white"}
            />
            <Flex mt={"0.5rem"} justifyContent={"space-between"}>
              <Skeleton
                isLoaded={!isLoading}
                minWidth={"8rem"}
                height={"1.8rem"}
              >
                <FormHelperText textColor={"white"}>
                  Balance: {swapOutTokenState?.balance}
                </FormHelperText>
              </Skeleton>
            </Flex>
          </FormControl>
          <Divider my={"2rem"} width={"full"} />
          <Button
            isLoading={isSwapping}
            width={"full"}
            size={"2xl"}
            height={"3rem"}
            onClick={swapHandler}
            isDisabled={
              swapInState.tokenAmount === 0 ||
              isLoading ||
              !validatedPreSwapState
            }
            textColor={"white"}
            bg={"gray.500"}
            border={"1px solid white"}
            textTransform={"uppercase"}
            letterSpacing={"0.1em"}
          >
            {userAddress
              ? validatedPreSwapState
                ? "SWAP"
                : "INSUFFICIENT BALANCE"
              : "CONNECT WALLET"}
          </Button>
        </CardBody>
      </Card>
    </>
  );
}

export default SwapCard;
