"use client";
import React, { memo } from "react";

// Components
import { Flex } from "@chakra-ui/react";
import { ProfileLPDetails } from "@/utils/helpers/types";
import ProfileLiquidityPositionsTable from "@/components/tables/ProfileLiquidityPositionsTable";
import TableHeader from "../common/TableHeader";

type ProfileLiquidityPositionsViewProps = {
  data: ProfileLPDetails;
};

function ProfileLiquidityPositionsView({
  data,
}: ProfileLiquidityPositionsViewProps) {
  return (
    <Flex
      width={"full"}
      mt={"5rem"}
      flexDir={"column"}
      justifyContent={"center"}
    >
      <TableHeader text={"Liquidity Positions"} />
      <ProfileLiquidityPositionsTable
        data={data.liquidityPositions}
        loading={!!!data.liquidityPositions}
      />
    </Flex>
  );
}

export default memo(ProfileLiquidityPositionsView);
