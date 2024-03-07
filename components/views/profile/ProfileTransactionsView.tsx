"use client";
import React, { useEffect } from "react";
import client from "@/utils/helpers/apollo-client";
import { useLazyQuery } from "@apollo/client";

// Subgraph Related
import { processProfileTransactionsData } from "@/utils/helpers/subgraph";
import { profileTransactionsQuery } from "@/utils/graphql/queries/profile-transactions-data";

// Components
import { Flex } from "@chakra-ui/react";
import TableHeader from "../common/TableHeader";
import ProfileTransactionTable from "@/components/tables/ProfileTransactionTable";

const PROFILE_TRANSACTIONS_INITIAL_PARAMS = (userAddress: string) => {
  return {
    first: 50,
    skip: 0,
    user: userAddress,
    types: ["MINT", "BURN", "SWAP"],
    orderDirection: "desc",
    orderBy: "timestamp",
  };
};

type ProfileTransactionsViewProps = {
  userAddress: string;
};

function ProfileTransactionsView({
  userAddress,
}: ProfileTransactionsViewProps) {
  console.log("PARAMS", PROFILE_TRANSACTIONS_INITIAL_PARAMS(userAddress));
  const [search, { loading, data, error, fetchMore }] = useLazyQuery(
    profileTransactionsQuery(),
    {
      client,
      variables: PROFILE_TRANSACTIONS_INITIAL_PARAMS(userAddress),
      nextFetchPolicy: "cache-and-network",
    }
  );
  console.log("SEETRANSACTIONS DATA", data, loading, error);

  useEffect(() => {
    if (userAddress) search();
  }, [userAddress]);

  const processedData = processProfileTransactionsData(data?.data) ?? null;
  console.log("SEE PROCESSED DATA:", processedData);
  return (
    <Flex
      width={"full"}
      flexDirection={"column"}
      mt={"5rem"}
      justifyContent={"center"}
    >
      <TableHeader text={"Recent Transactions"} />
      <ProfileTransactionTable
        data={processedData!}
        loading={!!!processedData}
      />
    </Flex>
  );
}

export default ProfileTransactionsView;
