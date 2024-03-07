"use client";

import React, { memo } from "react";
import { StatGroup, Flex } from "@chakra-ui/react";
import client from "@/utils/helpers/apollo-client";
import { useQuery } from "@apollo/client";

// Components
import BasicStatisticView from "@/components/views/common/BasicStatisticView";
import { processFactoryPoolPairsData } from "@/utils/helpers/subgraph";
import { factoryPoolPairsDataQuery } from "@/utils/graphql/queries/factory-pool-data";
import { DISPLAY_USD_DECIMALS } from "@/utils/helpers/misc";

function OverallMarketStatsView() {
  const { data, error } = useQuery(factoryPoolPairsDataQuery(), {
    client,
    variables: { id: "" },
  });
  console.log("SEE", processFactoryPoolPairsData(data!));
  const factoryStats = processFactoryPoolPairsData(data!)?.factoryStats;
  const loading = !!!factoryStats;
  return (
    <Flex mt={"2rem"}>
      <StatGroup
        alignItems={"center"}
        gap={["2rem"]}
        maxHeight={"9rem"}
        padding={"0rem"}
        fontSize={["xs", "sm", null, "md"]}
        color={"white"}
        letterSpacing={"0.08rem"}
        textTransform={"uppercase"}
        whiteSpace={"nowrap"}
        maxWidth={["80%", null, "90%", "50rem"]}
      >
        <BasicStatisticView
          largeMode
          headerText={"Total Value Locked"}
          displayValue={
            factoryStats?.totalTvlUSD?.toFixed(DISPLAY_USD_DECIMALS) ?? 0
          }
          loading={loading}
        />
        <BasicStatisticView
          largeMode
          headerText={"Total Volume"}
          displayValue={
            factoryStats?.totalVolumeUSD?.toFixed(DISPLAY_USD_DECIMALS) ?? 0
          }
          loading={loading}
        />
        <BasicStatisticView
          largeMode
          headerText={"Fees Generated"}
          displayValue={
            factoryStats?.totalFeeUSD.toFixed(DISPLAY_USD_DECIMALS) ?? 0
          }
          loading={loading}
        />
      </StatGroup>
    </Flex>
  );
}

export default memo(OverallMarketStatsView);
