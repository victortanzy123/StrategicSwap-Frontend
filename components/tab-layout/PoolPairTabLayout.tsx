"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
} from "@chakra-ui/react";
import {
  PairReserves,
  StrategicPairDetails,
  UserTokensState,
} from "@/utils/helpers/types";
import { useConnectWallet } from "@web3-onboard/react";
import {
  getUpdatedReserves,
  getUserTokenBalances,
} from "@/utils/helpers/web3-api";

// Components
import LiquidityCard from "../cards/liquidity/LiquidityCard";
import SwapCard from "../cards/swap/SwapCard";
import { processUserTokenStates } from "@/utils/helpers/misc";

type PoolPairTabLayoutProps = {
  pairAddress: string;
  data: StrategicPairDetails;
  loading: boolean;
};

function PoolPairTabLayout({
  pairAddress,
  data,
  loading,
}: PoolPairTabLayoutProps) {
  const [{ wallet }, connect, disconnect] = useConnectWallet();
  const user = wallet?.accounts[0].address ?? null;

  const [reserves, setReserves] = useState<PairReserves>({
    reserves0: "0",
    reserves1: "0",
  });
  const [userTokenBalances, setUserTokenBalances] =
    useState<UserTokensState | null>(null);

  async function fetchUserBalances(
    tokenAddresses: string[],
    user: string,
    isMounted: boolean
  ) {
    console.log("entered", user, tokenAddresses);
    if (!isMounted) return;

    try {
      const { balances, tokens } = await getUserTokenBalances(
        tokenAddresses,
        user
      );
      if (isMounted) {
        setUserTokenBalances(processUserTokenStates(tokens, balances));
      }
    } catch (error) {
      console.log("ERROR TOKEN BALANCE:", error);
    }
  }
  useEffect(() => {
    let isMounted = true;
    if (!!user && !!data) {
      const tokenAddresses = [
        data.token0.address,
        data.token1.address,
        pairAddress,
      ];
      fetchUserBalances(tokenAddresses, user, isMounted);
    }

    return () => {
      isMounted = false;
    };
  }, [user]);

  useEffect(() => {
    let isMounted = true;
    async function updateReservesData() {
      const res = await getUpdatedReserves(pairAddress);
      console.log("UPDATED RESERVES", res);
    }
    if (isMounted) updateReservesData();

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshUserTokenBalances = useCallback(() => {
    if (!!user && !!data) {
      const tokenAddresses = [
        data.token0.address,
        data.token1.address,
        pairAddress,
      ];
      fetchUserBalances(tokenAddresses, user, true);
    }
  }, [user]);
  return (
    <Flex width={"full"} justifyContent={"center"}>
      <Tabs
        mt={"2rem"}
        variant={"soft-rounded"}
        maxWidth={"55rem"}
        width={"full"}
        isLazy
        isFitted
        colorScheme={"gray"}
      >
        <TabList>
          <Tab
            textTransform={"uppercase"}
            letterSpacing={"0.06em"}
            fontWeight={400}
            fontSize={"2xl"}
            textColor={"white"}
          >
            Liquidity
          </Tab>
          <Tab
            textTransform={"uppercase"}
            letterSpacing={"0.06em"}
            fontWeight={400}
            fontSize={"2xl"}
            textColor={"white"}
          >
            Swap
          </Tab>
        </TabList>
        <TabPanels height={"35rem"}>
          <TabPanel>
            <LiquidityCard
              userTokenBalances={userTokenBalances}
              refreshUserTokenBalances={refreshUserTokenBalances}
              reserves={reserves}
              data={data}
              pairAddress={pairAddress}
              connect={connect}
            />
          </TabPanel>
          <TabPanel>
            <SwapCard
              data={data}
              userTokenBalances={userTokenBalances}
              refreshUserTokenBalances={refreshUserTokenBalances}
              userAddress={user}
              wallet={wallet}
              pairAddress={pairAddress}
              connect={connect}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}

export default PoolPairTabLayout;
