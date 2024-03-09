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
      console.log("SEE HERE LP", balances, tokens);
    }
  } catch (error) {
    console.log("ERROR TOKEN BALANCE:", error);
  }
}

type LiquidityCardProps = {
  pairAddress: string;
  reserves: PairReserves;
  data: StrategicPairDetails;
  userTokenBalances: UserTokensState | null;
  refreshUserTokenBalances: () => void;
  connect: any;
};

const TEST_POOL_ADDRESS = "0x124d3f000630A23A51e34A402596DB25645E5693";

function LiquidityCard({
  data,
  reserves,
  pairAddress,
  userTokenBalances,
  refreshUserTokenBalances,
}: LiquidityCardProps) {
  const [{ wallet }, connect, disconnect] = useConnectWallet();
  const user = wallet?.accounts[0].address ?? null;

  console.log("SEE DATA IN LIQUIDITY CARD", data, wallet);

  console.log("SEE DATA", data);

  const numberCheck = (input: string): boolean => {
    // setValidInput(/^\d+\.\d+$/.test(input) && /^\d+$/.test(input));
    return (
      /^\d+\.\d+$/.test(input) || /^\d+$/.test(input) || input.length === 0
    );
  };

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

  // await previewSwapAmountOut(TEST_POOL_ADDRESS, TOKENS[0], "10000");

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
    // <div className="flex flex-col min-w-80rem p-8  z-10">
    //   <div className="rounded-3xl rounded-tr-3xl border-4 border-blue-500 bg-blue-500 px-8 py-4">
    //     <LiquidityHeader poolConfigData={DAI_USDC_POOL_METADATA} />
    //     <div className=" px-8 py-2 rounded-bl-3xl rounded-br-3xl ">
    //       <DualTabs
    //         label1={"DEPOSIT"}
    //         label2={"WITHDRAW"}
    //         activeTab={activeTab}
    //         setActiveTab={setActiveTab}
    //       />
    //       <ValueInput
    //         className="w-full mt-4 bg-white"
    //         onChangeHandler={setInputValue}
    //       />
    //       <LoaderButton
    //         className="my-4 w-full"
    //         isRounded={true}
    //         text={activeTab === 0 ? "Deposit" : "Withdraw"}
    //         onClick={() => {}}
    //         isLoading={loading}
    //         isDisabled={!validInput || !inputValue}
    //       />
    //     </div>
    //   </div>
    // </div>
  );
}

export default LiquidityCard;
