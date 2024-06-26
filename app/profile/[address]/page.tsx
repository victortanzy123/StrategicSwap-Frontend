// Components
import client from "@/utils/helpers/apollo-client";

// Subgraph Related
import { processProfileLiquidityPositionsData } from "@/utils/helpers/subgraph";
import { ProfileLPDetails } from "@/utils/helpers/types";
import { profileLiquidityPositionsQuery } from "@/utils/graphql/queries/profile-liquidity-positions-data";
import { truncateAddress } from "@/utils/helpers/misc";

// Components
import { PageWrapper } from "@/components/styles/page-wrapper";
import ProfileTransactionsView from "@/components/views/profile/ProfileTransactionsView";
import ProfileStatistics from "@/components/views/profile/ProfileStatistics";
import ProfileLiquidityPositionsView from "@/components/views/profile/ProfileLiquidityPositionsView";

const PROFILE_LP_DATA_INTIAL_PARAMS = (user: string) => {
  return {
    first: 50,
    skip: 0,
    orderDirection: "asc",
    orderBy: "id",
    user,
  };
};

//Export this to put a default fetching config (does not override the fetch)
export const dynamic = "force-dynamic";

async function fetchProfileLiquidityPositionsData(
  address: string
): Promise<ProfileLPDetails | null> {
  const { data, loading } = await client.query({
    query: profileLiquidityPositionsQuery(),
    variables: { ...PROFILE_LP_DATA_INTIAL_PARAMS(address) },
    fetchPolicy: "no-cache",
  });

  const poolData = processProfileLiquidityPositionsData(data?.data)!;

  return poolData;
}

export default async function Page({
  params,
}: {
  params: { address: string };
}) {
  const userAddress = params.address;
  const res = await fetchProfileLiquidityPositionsData(userAddress);

  return (
    <PageWrapper>
      <div
        className={
          "w-100%  flex justify-center  mt-20 mb-10 text-6xl text-white uppercase tracking-widest"
        }
      >
        {truncateAddress(userAddress)} Profile
      </div>
      <div className="flex justify-center flex-col max-w-60 h-80vh align-middle ">
        <ProfileStatistics data={res!} />
        <ProfileLiquidityPositionsView data={res!} />
        <ProfileTransactionsView userAddress={userAddress} />
      </div>
    </PageWrapper>
  );
}
