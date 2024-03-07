"use client";
import React from "react";
import { useQuery } from "@apollo/client";
import client from "@/utils/helpers/apollo-client";
import { factoryPoolPairsDataQuery } from "@/utils/graphql/queries/factory-pool-data";
import { processFactoryPoolPairsData } from "@/utils/helpers/subgraph";

// Components
import PoolLayout from "./pool-layout";
import PoolHeader from "./pool-header";
import MarketsDisplayStatsView from "../protocol/MarketsDisplayStatsView";

function PoolMainView() {
  const { data, error } = useQuery(factoryPoolPairsDataQuery(), {
    client,
    variables: { id: "" },
  });
  console.log("SEE", processFactoryPoolPairsData(data!));
  const processedData = processFactoryPoolPairsData(data!);
  const factoryStats = processedData?.factoryStats;
  const pairsData = processedData?.pairsData;
  const loading = !!!factoryStats || !!!pairsData;
  return (
    <>
      <PoolHeader />
      <MarketsDisplayStatsView data={factoryStats!} loading={loading} />
      <PoolLayout data={pairsData!} loading={loading} />
    </>
  );
}

export default PoolMainView;
