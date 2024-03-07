"use client";
import React, { memo } from "react";
import { StatGroup, Divider, Flex } from "@chakra-ui/react";

// Components
import BasicStatisticView from "@/components/views/common/BasicStatisticView";
import { ProfileLPDetails } from "@/utils/helpers/types";
import { DISPLAY_USD_DECIMALS } from "@/utils/helpers/misc";

type ProfileStatsProps = {
  data: ProfileLPDetails;
};

function ProfileStatistics({ data }: ProfileStatsProps) {
  const { liquidityPositions, profileTotalVolume, profileTvl } = data;
  const lpCount = liquidityPositions?.length ?? 0;
  const loading = !!!data;
  return (
    <Flex width={"full"} justifyContent={"center"}>
      <StatGroup gap={"2rem"}>
        <BasicStatisticView
          headerText={"Total Value Locked (USD)"}
          displayValue={profileTvl.toFixed(DISPLAY_USD_DECIMALS)}
          loading={loading}
        />
        <Divider orientation="vertical" />
        <BasicStatisticView
          headerText={"Total Volume Traded (USD)"}
          displayValue={profileTotalVolume.toFixed(DISPLAY_USD_DECIMALS)}
          loading={loading}
        />
        <Divider orientation="vertical" />
        <BasicStatisticView
          headerText={"Total LP Positions"}
          displayValue={lpCount.toFixed(DISPLAY_USD_DECIMALS)}
          loading={loading}
        />
      </StatGroup>
    </Flex>
  );
}

export default memo(ProfileStatistics);
