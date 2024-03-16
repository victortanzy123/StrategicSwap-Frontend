"use client";
import React from "react";
import Image from "next/image";
import { PoolConfigModel } from "@/utils/constants/pool-configs";
import { DEFAULT_CHAIN_DETAILS } from "@/utils/helpers/web3";

// Icons
import { InfoIcon } from "@chakra-ui/icons";
import { Divider, Flex, Text, Tooltip } from "@chakra-ui/react";
import ApyView from "@/components/views/common/ApyView";

type LiquidityHeaderProps = {
  poolConfigData: PoolConfigModel;
};

function LiquidityHeader({ poolConfigData }: LiquidityHeaderProps) {
  const { token0, token1, name, yieldPercentage } = poolConfigData;
  return (
    <div className="flex justify-center w-full text-3xl text-white items-center">
      <Image
        src={token0.image}
        width={60}
        height={60}
        alt="icon"
        className="mr-4"
      />
      <Image
        src={token1.image}
        width={60}
        height={60}
        alt="icon"
        className="mr-4"
      />
      <div className="flex flex-col font-displa  text-white">
        {name}
        <p className="text-sm italic text-white font-body">
          {DEFAULT_CHAIN_DETAILS.chain}
        </p>
      </div>
      <div className="grow" />
      <div className="flex flex-col items-end">
        <Flex
          px={"0.5rem"}
          py={"0.25rem"}
          width={"20rem"}
          height={"7.5rem"}
          background={"gray.700"}
          borderRadius={"1rem"}
          flexDirection={"column"}
        >
          <Flex width={"full"} justifyContent={"space-between"}>
            {" "}
            <Text
              textTransform={"uppercase"}
              fontWeight={"bold"}
              fontSize={"lg"}
              letterSpacing={"0.06em"}
            >
              Overall APY:{" "}
            </Text>
            <Text
              textTransform={"uppercase"}
              fontWeight={"bold"}
              fontSize={"lg"}
              letterSpacing={"0.06em"}
            >
              <span>&gt;</span> {15.0}%
              <Tooltip label={"Passive APY + Trading APY"} hasArrow>
                <InfoIcon mx={"0.5rem"} />
              </Tooltip>
            </Text>
          </Flex>
          <Divider width={"full"} height={"1rem"} color={"white"} />

          <ApyView
            apyType={"Passive"}
            hoverText={
              "Interest from native underlying ERC-4626 yield-accruing vaults (sDAI & fUSDC)."
            }
            yieldPercentage={5.0}
          />
          <ApyView
            apyType={"Trading"}
            hoverText={"Interest from trading fees of strategic pool."}
            yieldPercentage={10.8}
          />
        </Flex>
      </div>
    </div>
  );
}

export default LiquidityHeader;
