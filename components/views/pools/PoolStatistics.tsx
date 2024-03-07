"use client";
import React, { memo } from "react";
import { StatGroup, Divider, Flex } from "@chakra-ui/react";

// Components
import BasicStatisticView, {
  ViewType,
} from "@/components/views/common/BasicStatisticView";
import { StrategicPairDetails } from "@/utils/helpers/types";
import {
  DEFAULT_DECIMALS_PRECISION,
  DISPLAY_USD_DECIMALS,
} from "@/utils/helpers/misc";

type PoolStatsProps = {
  data: StrategicPairDetails;
};

function PoolStatistics({ data }: PoolStatsProps) {
  const { isStable, totalFeeGenerated, totalVolume, tvl } = data;
  const poolModeDisplayValue = isStable ? "STABLE" : "VOLATILE";
  const loading = !!!data;
  return (
    <Flex width={"full"} justifyContent={"center"} mb={"3rem"}>
      <StatGroup gap={"2rem"}>
        <BasicStatisticView
          headerText={"Total Value Locked (USD)"}
          displayValue={tvl.toFixed(DISPLAY_USD_DECIMALS)}
          loading={loading}
        />
        <Divider orientation="vertical" />
        <BasicStatisticView
          headerText={"Total Volume Traded (USD)"}
          displayValue={totalVolume.toFixed(DISPLAY_USD_DECIMALS)}
          loading={loading}
        />
        <Divider orientation="vertical" />
        <BasicStatisticView
          headerText={"Total Fees Generate (USD)"}
          displayValue={totalFeeGenerated.toFixed(DISPLAY_USD_DECIMALS)}
          loading={loading}
        />
        <Divider orientation="vertical" />
        <BasicStatisticView
          headerText={"Mode"}
          displayValue={poolModeDisplayValue}
          loading={loading}
          type={ViewType.TAG}
        />
      </StatGroup>
    </Flex>
  );
}

export default memo(PoolStatistics);
