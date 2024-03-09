"use client";
import { FactoryStatistics } from "@/utils/helpers/types";
import React, { memo } from "react";
import { StatGroup, Divider, Flex } from "@chakra-ui/react";
import { DISPLAY_USD_DECIMALS } from "@/utils/helpers/misc";

// Components
import BasicStatisticView from "@/components/views/common/BasicStatisticView";

type MarketsDisplayStatsViewProps = {
  data: FactoryStatistics;
  loading: boolean;
};

function MarketsDisplayStatsView({
  data,
  loading,
}: MarketsDisplayStatsViewProps) {
  return (
    <Flex justifyContent={"center"}>
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
        maxWidth={["80%", null, "90%", "70rem"]}
      >
        <BasicStatisticView
          largeMode
          headerText={"Pool Pairs"}
          displayValue={data?.pairCount ?? 0}
          loading={loading}
        />
        <Divider orientation="vertical" />
        <BasicStatisticView
          largeMode
          headerText={"Total Value Locked"}
          displayValue={data?.totalTvlUSD?.toFixed(DISPLAY_USD_DECIMALS) ?? 0}
          loading={loading}
        />
        <Divider orientation="vertical" />
        <BasicStatisticView
          largeMode
          headerText={"Total Volume"}
          displayValue={
            data?.totalVolumeUSD?.toFixed(DISPLAY_USD_DECIMALS) ?? 0
          }
          loading={loading}
        />
        <Divider orientation="vertical" />
        <BasicStatisticView
          largeMode
          headerText={"Fees Generated"}
          displayValue={data?.totalFeeUSD.toFixed(DISPLAY_USD_DECIMALS) ?? 0}
          loading={loading}
        />
      </StatGroup>
    </Flex>
  );
}

export default memo(MarketsDisplayStatsView);
