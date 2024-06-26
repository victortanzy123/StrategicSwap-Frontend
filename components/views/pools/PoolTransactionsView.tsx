"use client";
import React, { useEffect } from "react";
import client from "@/utils/helpers/apollo-client";
import { useLazyQuery } from "@apollo/client";
import { poolPairTransactionsQuery } from "@/utils/graphql/queries/pool-pair-transactions-data";

// Components
import PoolPairTransactionTable from "@/components/tables/PoolPairTransactionTable";
import { Flex } from "@chakra-ui/react";
import { processPoolTransactionsData } from "@/utils/helpers/subgraph";
import TableHeader from "../common/TableHeader";
const POOL_INITIAL_PARAMS = (pairAddress: string) => {
  return {
    first: 10,
    skip: 0,
    id: pairAddress.toLowerCase(),
    orderDirection: "desc",
    orderBy: "timestamp",
  };
};

type PoolTransactionsViewProps = {
  pairAddress: string;
};

function PoolTransactionsView({ pairAddress }: PoolTransactionsViewProps) {
  const [search, { loading, data, error, fetchMore }] = useLazyQuery(
    poolPairTransactionsQuery(),
    {
      client,
      variables: POOL_INITIAL_PARAMS(pairAddress),
      nextFetchPolicy: "cache-and-network",
    }
  );

  useEffect(() => {
    if (pairAddress) search();
  }, [pairAddress]);

  const processedData = processPoolTransactionsData(data?.data) ?? null;

  return (
    <Flex
      width={"full"}
      flexDirection={"column"}
      mt={"12rem"}
      justifyContent={"center"}
    >
      <TableHeader text={"Recent Transactions"} center />
      <PoolPairTransactionTable
        data={processedData!}
        loading={!!!processedData}
      />
    </Flex>
  );
}

export default PoolTransactionsView;
