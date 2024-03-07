// Components

import client from "@/utils/helpers/apollo-client";
import { GetServerSidePropsResult } from "next";

// Subgraph Related
import { strategicPoolPairQuery } from "@/utils/graphql/queries/single-pool-pair-data";
import { processSinglePairData } from "@/utils/helpers/subgraph";
import { StrategicPairDetails } from "@/utils/helpers/types";

// Components
import { PageWrapper } from "@/components/styles/page-wrapper";
import PoolPairTabLayout from "@/components/tab-layout/PoolPairTabLayout";
import PoolStatistics from "@/components/views/pools/PoolStatistics";
import PoolTransactionsView from "@/components/views/pools/PoolTransactionsView";

type PoolPairPageProps = {
  data: StrategicPairDetails;
  address: string;
};

//Export this to put a default fetching config (does not override the fetch)
export const dynamic = "force-dynamic";

//🌨️ Next.js 12 implementation
async function getServerSideProps(
  context: any
): Promise<GetServerSidePropsResult<PoolPairPageProps>> {
  console.log("SEE CONTEXT QUERY", context.query);
  const id = context.query?.address;

  const { data, loading } = await client.query({
    query: strategicPoolPairQuery(),
    variables: { id },
  });
  console.log("See data", data);
  const poolData = processSinglePairData(data?.dats)!;
  console.log("Pool Data", poolData);
  return {
    props: {
      address: id,
      data: poolData,
    },
  };
}

async function fetchPoolPairData(
  address: string
): Promise<StrategicPairDetails | null> {
  const { data, loading } = await client.query({
    query: strategicPoolPairQuery(),
    variables: { id: address.toLowerCase() },
  });

  const poolData = processSinglePairData(data?.data)!;
  console.log("See data -> ", data, poolData);
  return poolData;
}

export default async function Page({ params }: any) {
  const pairAddress = params?.address;
  const res = await fetchPoolPairData(pairAddress);

  console.log("SEE DATA here", params, res);

  return (
    <PageWrapper>
      <div className="flex justify-center flex-col max-w-60 h-100vh align-middle ">
        <PoolStatistics data={res!} />
        <PoolPairTabLayout
          pairAddress={pairAddress}
          data={res!}
          loading={!!!res}
        />
        <PoolTransactionsView pairAddress={pairAddress} />
      </div>
    </PageWrapper>
  );
}
