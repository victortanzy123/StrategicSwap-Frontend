"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { Flex, Skeleton } from "@chakra-ui/react";
import { useMemo } from "react";
import { LiquidityPositionDetails } from "@/utils/helpers/types";

import EmptyTextHeader from "../common/headers/EmptyTextHeader";
import ExternalLink from "../common/links/ExternalLink";
import { BaseDataTable } from "./BaseDataTable";
import { NULL_ADDRESS } from "@/utils/constants";

const MOCK_DATA: LiquidityPositionDetails[] = [
  {
    user: NULL_ADDRESS,
    pair: NULL_ADDRESS,
    pairName: "DAI-USDC",
    isStable: true,
    reserve0: 0,
    reserve1: 0,
    token0Stake: 0,
    token1Stake: 0,
    lpTokenBalance: 0,
    tvl: 0,
    totalSupply: 0,
  },
  {
    user: NULL_ADDRESS,
    pair: NULL_ADDRESS,
    pairName: "DAI-USDC",
    isStable: true,
    reserve0: 0,
    reserve1: 0,
    token0Stake: 0,
    token1Stake: 0,
    lpTokenBalance: 0,
    tvl: 0,
    totalSupply: 0,
  },
];

const columnHelper = createColumnHelper<LiquidityPositionDetails>();

export default function ProfileLiquidityPositionsTable({
  data,
  loading = true,
}: {
  data: LiquidityPositionDetails[] | null;
  loading?: boolean;
}) {
  const isEmpty: boolean = data!?.length === 0 && !loading;
  // Dynamic display of columns
  const getColumnDisplay = useMemo(() => {
    return [
      columnHelper.accessor("pairName", {
        cell: (info) =>
          loading ? (
            <Skeleton orientation="horizontal" width={"full"} height={"2rem"} />
          ) : (
            info.getValue()
          ),
        header: "Pair",
      }),
      columnHelper.accessor("isStable", {
        cell: (info) =>
          loading ? (
            <Skeleton orientation="horizontal" width={"full"} height={"2rem"} />
          ) : (
            info.getValue()
          ),
        header: "Mode",
      }),
      columnHelper.accessor("token0Stake", {
        cell: (info) =>
          loading ? (
            <Skeleton orientation="horizontal" width={"80%"} height={"2rem"} />
          ) : (
            info.getValue()
          ),
        header: "Amount (Token0)",
      }),
      columnHelper.accessor("token1Stake", {
        cell: (info) =>
          loading ? (
            <Skeleton orientation="horizontal" width={"80%"} height={"2rem"} />
          ) : (
            info.getValue()
          ),
        header: "Amount (Token1)",
      }),
      columnHelper.accessor("lpTokenBalance", {
        cell: (info) =>
          loading ? (
            <Skeleton orientation="horizontal" width={"80%"} height={"2rem"} />
          ) : (
            info.getValue()
          ),
        header: "LP Token Amount",
      }),
      columnHelper.accessor("tvl", {
        cell: (info) =>
          loading ? (
            <Skeleton orientation="horizontal" width={"80%"} height={"2rem"} />
          ) : (
            info.getValue()
          ),
        header: "USD Value",
      }),
    ];
  }, [loading]);

  return (
    <Flex width={"full"}>
      <BaseDataTable columns={getColumnDisplay} data={data ?? MOCK_DATA} />
      {isEmpty ? (
        <EmptyTextHeader minimised text={"No Liquidity Positions Yet"} />
      ) : (
        <></>
      )}
    </Flex>
  );
}
