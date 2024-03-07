import { createColumnHelper } from "@tanstack/react-table";
import { DEFAULT_CHAIN_DETAILS } from "@/utils/helpers/web3";
import { truncateHexString } from "@/utils/helpers/misc";
import { Flex, Skeleton } from "@chakra-ui/react";
import { useMemo } from "react";
import { TransactionRecordDetails } from "@/utils/helpers/types";

import EmptyTextHeader from "../common/headers/EmptyTextHeader";
import ExternalLink from "../common/links/ExternalLink";
import { BaseDataTable } from "./BaseDataTable";

const MOCK_DATA: TransactionRecordDetails[] = [
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
  },
  {
    to: "0x123",
    from: "0x123",
    type: "SWAP",
    amount0In: 1,
    amount1In: 1,
    amount0Out: 1,
    amount1Out: 1,
    amountUSD: 2,
    hash: "0x123",
    timestamp: 1000000,
  },
];

const columnHelper = createColumnHelper<TransactionRecordDetails>();

export default function PoolPairTransactionTable({
  data,
  loading = true,
}: {
  data: TransactionRecordDetails[] | null;
  loading?: boolean;
}) {
  const isEmpty: boolean = data!?.length === 0 && !loading;
  // Dynamic display of columns
  const getColumnDisplay = useMemo(() => {
    return [
      columnHelper.accessor("type", {
        cell: (info) =>
          loading ? (
            <Skeleton orientation="horizontal" width={"full"} height={"2rem"} />
          ) : (
            info.getValue()
          ),
        header: "Type",
      }),
      columnHelper.accessor("from", {
        cell: (info) =>
          loading ? (
            <Skeleton orientation="horizontal" width={"80%"} height={"2rem"} />
          ) : (
            info.getValue()
          ),
        header: "From",
      }),
      columnHelper.accessor("to", {
        cell: (info) =>
          loading ? (
            <Skeleton orientation="horizontal" width={"80%"} height={"2rem"} />
          ) : (
            info.getValue()
          ),
        header: "To",
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
        <EmptyTextHeader minimised text={"No Mint Records Yet"} />
      ) : (
        <></>
      )}
    </Flex>
  );
}
