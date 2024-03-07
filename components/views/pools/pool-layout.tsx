"use client";
import { memo, useEffect } from "react";
// Apollo Client
import client, { MAIN_SUBGRAPH_URL } from "@/utils/helpers/apollo-client";
import { useLazyQuery, useQuery } from "@apollo/client";
import { factoryStatisticsQuery } from "@/utils/graphql/queries/factory-statistics";
import { FACTORY_ADDRESS } from "@/utils/constants";

// Web3 API
import {
  getUpdatedReserves,
  getUserTokenBalances,
  previewSwapAmountOut,
} from "@/utils/helpers/web3-api";

// Components
import PoolCard from "./pool-card";
import { factoryPoolPairsDataQuery } from "@/utils/graphql/queries/factory-pool-data";
import { strategicPoolPairQuery } from "@/utils/graphql/queries/single-pool-pair-data";
import { StrategicPairDetails } from "@/utils/helpers/types";
import { Flex, Spinner } from "@chakra-ui/react";

const INITIAL_QUERY_PARAMS = {
  id: FACTORY_ADDRESS,
  first: 100,
  skip: 0,
  orderBy: "createdAtTimestamp",
  orderDirection: "asc",
};
const TEST_POOL_ADDRESS = "0x124d3f000630A23A51e34A402596DB25645E5693";
const TOKENS = [
  "0x4Ee80e4CA7CdC16540574d7faBe434537d2345b0",
  "0x78D91d7B51Eb07FC4B13c514EDDf566C3d12261F",
  TEST_POOL_ADDRESS,
];

async function testMulticall(
  tokenAddresses: string[],
  user: string,
  isMounted: boolean
) {
  if (!isMounted) return;

  try {
    const { balances, tokens } = await getUserTokenBalances(
      tokenAddresses,
      user
    );
    if (isMounted) {
      console.log("SEE HERE", balances, tokens);
    }
  } catch (error) {
    console.log("ERROR TOKEN BALANCE:", error);
  }
}

type PoolLayoutProps = {
  data: Partial<StrategicPairDetails>[];
  loading: boolean;
};

function PoolLayout({ data, loading }: PoolLayoutProps) {
  console.log("SEE ", MAIN_SUBGRAPH_URL, client, INITIAL_QUERY_PARAMS);
  // const [_, { loading, data, error }] = useLazyQuery(factoryStatisticsQuery(), {
  //   client,
  //   variables: INITIAL_QUERY_PARAMS,
  // });
  // console.log("SEE RESULT", loading, data, error);
  // const { loading, data, error } = useQuery(factoryStatisticsQuery(), {
  //   client,
  //   variables: { id: "" },
  // });
  // const { loading, data, error } = useQuery(factoryPoolPairsDataQuery(), {
  //   client,
  //   variables: INITIAL_QUERY_PARAMS,
  // });

  console.log("SEE HERE POOL LAYOUT", loading, data);

  // useEffect(() => {
  //   let isMounted = true;

  //   async function test() {
  //     await getUpdatedReserves(TEST_POOL_ADDRESS);
  //     await previewSwapAmountOut(TEST_POOL_ADDRESS, TOKENS[0], "10000");
  //   }

  //   testMulticall(
  //     TOKENS,
  //     "0x42c0810EF178f96FD76f085e48bd8a2a480Ba727",
  //     isMounted
  //   );
  //   test();

  //   return () => {
  //     isMounted = false;
  //   };
  // }, []);
  return (
    <>
      {loading ? (
        <Flex
          width={"full"}
          height={"50vh"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          {" "}
          <Spinner size={"xl"} />
        </Flex>
      ) : (
        <div
          className={`mt-20 px-10 grid grid-cols-1 md:grid-cols-2 justify-items-center xl:grid-cols-4 gap-x-8 gap-y-14`}
        >
          {data?.map((pool, i) => (
            <PoolCard key={i} loading={loading} data={pool} />
          ))}
        </div>
      )}
    </>
  );
}

export default memo(PoolLayout);
