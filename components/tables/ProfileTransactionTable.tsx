"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { DEFAULT_CHAIN_DETAILS, DEFAULT_DECIMALS } from "@/utils/helpers/web3";
import { truncateHexString } from "@/utils/helpers/misc";
import { Flex, Skeleton } from "@chakra-ui/react";
import { useMemo } from "react";
import { ProfileTransactionRecordDetails } from "@/utils/helpers/types";

import EmptyTextHeader from "../common/headers/EmptyTextHeader";
import ExternalLink from "../common/links/ExternalLink";
import { BaseDataTable } from "./BaseDataTable";
import { NULL_ADDRESS } from "@/utils/constants";

const MOCK_DATA: ProfileTransactionRecordDetails[] = [
  {
    to: "0x123",
    from: "0x123",
    type: "MINT",
    amount0In: 1,
    amount1In: 1,
    amount0Out: 1,
    amount1Out: 1,
    amountUSD: 2,
    hash: "0x123",
    timestamp: 1000000,
    pair: "0x234",
    pairName: "DAI-USDC",
    isStable: true,
    reserve0: 0,
    reserve1: 0,
    tvl: 0,
    totalSupply: 0,
    token0: {
      address: NULL_ADDRESS,
      name: "MOCK",
      symbol: "MOCK",
      decimals: DEFAULT_DECIMALS,
      liquidityDeposited: 1,
      tradeVolume: 1,
      swapTxCount: 2,
    },
    token1: {
      address: NULL_ADDRESS,
      name: "MOCK",
      symbol: "MOCK",
      decimals: DEFAULT_DECIMALS,
      liquidityDeposited: 1,
      tradeVolume: 1,
      swapTxCount: 2,
    },
  },
  {
    to: "0x123",
    from: "0x123",
    type: "MINT",
    amount0In: 1,
    amount1In: 1,
    amount0Out: 1,
    amount1Out: 1,
    amountUSD: 2,
    hash: "0x123",
    timestamp: 1000000,
    pair: "0x234",
    pairName: "DAI-USDC",
    isStable: true,
    reserve0: 0,
    reserve1: 0,
    tvl: 0,
    totalSupply: 0,
    token0: {
      address: NULL_ADDRESS,
      name: "MOCK",
      symbol: "MOCK",
      decimals: DEFAULT_DECIMALS,
      liquidityDeposited: 1,
      tradeVolume: 1,
      swapTxCount: 2,
    },
    token1: {
      address: NULL_ADDRESS,
      name: "MOCK",
      symbol: "MOCK",
      decimals: DEFAULT_DECIMALS,
      liquidityDeposited: 1,
      tradeVolume: 1,
      swapTxCount: 2,
    },
  },
];

const columnHelper = createColumnHelper<ProfileTransactionRecordDetails>();

export default function ProfileTransactionTable({
  data,
  loading = true,
}: {
  data: ProfileTransactionRecordDetails[] | null;
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
      columnHelper.accessor("type", {
        cell: (info) =>
          loading ? (
            <Skeleton orientation="horizontal" width={"full"} height={"2rem"} />
          ) : (
            info.getValue()
          ),
        header: "Type",
      }),
      columnHelper.accessor("amount0In", {
        cell: (info) =>
          loading ? (
            <Skeleton orientation="horizontal" width={"80%"} height={"2rem"} />
          ) : (
            info.getValue()
          ),
        header: "Amount0In",
      }),
      columnHelper.accessor("amount1In", {
        cell: (info) =>
          loading ? (
            <Skeleton orientation="horizontal" width={"80%"} height={"2rem"} />
          ) : (
            info.getValue()
          ),
        header: "Amount1In",
      }),
      columnHelper.accessor("amount0Out", {
        cell: (info) =>
          loading ? (
            <Skeleton orientation="horizontal" width={"80%"} height={"2rem"} />
          ) : (
            info.getValue()
          ),
        header: "Amount0Out",
      }),
      columnHelper.accessor("amount1Out", {
        cell: (info) =>
          loading ? (
            <Skeleton orientation="horizontal" width={"80%"} height={"2rem"} />
          ) : (
            info.getValue()
          ),
        header: "Amount1Out",
      }),
      columnHelper.accessor("amountUSD", {
        cell: (info) =>
          loading ? (
            <Skeleton orientation="horizontal" width={"80%"} height={"2rem"} />
          ) : (
            info.getValue()
          ),
        header: "USD Value",
      }),
      columnHelper.accessor("timestamp", {
        cell: (info) =>
          loading ? (
            <Skeleton
              orientation="horizontal"
              width={"10rem"}
              height={"2rem"}
            />
          ) : (
            info.getValue()
          ),
        header: "date",
      }),
      columnHelper.accessor("hash", {
        cell: (info) =>
          loading ? (
            <Skeleton orientation="horizontal" width={"full"} height={"2rem"} />
          ) : (
            <ExternalLink
              href={`https://${
                DEFAULT_CHAIN_DETAILS.explorerLinkPrefix
              }tx/${info.getValue()}`}
              text={truncateHexString(info.getValue())}
            />
          ),
        header: "Transaction",
        meta: {
          isNumeric: true,
        },
      }),
    ];
  }, [loading]);

  return (
    <Flex width={"full"}>
      <BaseDataTable columns={getColumnDisplay} data={data ?? MOCK_DATA} />
      {isEmpty ? (
        <EmptyTextHeader minimised text={"No Transaction Records Yet"} />
      ) : (
        <></>
      )}
    </Flex>
  );
}
