"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
} from "@chakra-ui/react";
import { DAI_USDC_POOL_METADATA } from "@/utils/constants/pool-configs";

// Functions
import { getUserTokenBalances } from "@/utils/helpers/web3-api";
// Components
import LiquidityHeader from "./LiquidityHeader";
import {
  PairReserves,
  StrategicPairDetails,
  UserTokensState,
} from "@/utils/helpers/types";
import { useConnectWallet } from "@web3-onboard/react";
import LiquidityDepositComponent from "./LiquidityDepositComponent";
import LiquidityWithdrawalComponent from "./LiquidityWithdrawalComponent";

// [`token0`, `token1`, `lpToken`]

type LiquidityCardProps = {
  pairAddress: string;
  reserves: PairReserves;
  data: StrategicPairDetails;
  userTokenBalances: UserTokensState | null;
  refreshUserTokenBalances: () => void;
  connect: any;
};

function LiquidityCard({
  data,
  reserves,
  pairAddress,
  userTokenBalances,
  refreshUserTokenBalances,
}: LiquidityCardProps) {
  const [{ wallet }] = useConnectWallet();
  const user = wallet?.accounts[0].address ?? null;

  return (
    <Card
      paddingX={"0.5rem"}
      borderRadius={"2rem"}
      height={"45rem"}
      bg={"gray.600"}
    >
      <CardHeader justifyContent={"center"}>
        <LiquidityHeader poolConfigData={DAI_USDC_POOL_METADATA} />
      </CardHeader>
      <CardBody>
        <Flex width={"full"} justifyContent={"center"}>
          {" "}
          <Tabs
            variant="soft-rounded"
            colorScheme="gray"
            height={"35rem"}
            width={"full"}
          >
            <TabList width={"full"} justifyContent={"center"}>
              <Tab
                textTransform={"uppercase"}
                letterSpacing={"0.06em"}
                fontWeight={400}
                fontSize={"xl"}
                textColor={"white"}
              >
                DEPOSIT
              </Tab>
              <Tab
                textTransform={"uppercase"}
                letterSpacing={"0.06em"}
                fontWeight={400}
                fontSize={"xl"}
                textColor={"white"}
              >
                WITHDRAW
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <LiquidityDepositComponent
                  pair={data}
                  pairAddress={pairAddress}
                  user={user}
                  wallet={wallet}
                  userTokenBalancesState={userTokenBalances}
                  refreshUserTokenBalances={refreshUserTokenBalances}
                />
              </TabPanel>
              <TabPanel>
                <LiquidityWithdrawalComponent
                  pair={data}
                  pairAddress={pairAddress}
                  user={user}
                  wallet={wallet}
                  userTokenBalancesState={userTokenBalances}
                  refreshUserTokenBalances={refreshUserTokenBalances}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      </CardBody>
    </Card>
  );
}

export default LiquidityCard;
