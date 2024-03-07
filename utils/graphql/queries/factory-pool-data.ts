import gql from "graphql-tag";
import { FACTORY_STATISTICS_FIELD, TOKEN_FIELD } from "../fragments";

export function factoryPoolPairsDataQuery() {
  return gql`
    ${FACTORY_STATISTICS_FIELD}
    ${TOKEN_FIELD}
    query GetFactoryStatistics(
      $id: String
      $first: Int
      $skip: Int
      $orderBy: String
      $orderDirection: String
    ) {
      strategicSwapFactory(id: "") {
        id
        pairCount
        totalVolumeUSD
        totalFeeUSD
      }
      pairs(
        first: $first
        skip: $skip
        orderBy: $orderBy
        orderDirection: $orderDirection
      ) {
        id
        token0 {
          ...TokenFields
        }
        token1 {
          ...TokenFields
        }
        vault0
        vault1
        isStable
        reserve0
        reserve1
        totalSupply
        token0Fee
        token1Fee
        token0FeePercent
        token1FeePercent
        volumeToken0
        volumeToken1
        createdAtTimestamp
        createdAtBlockNumber
      }
    }
  `;
}
/*
  pairs(first: $first, skip: $skip, orderBy: $orderBy) {
        token0 {
          ...TokenFields
        }
        token1 {
          ...TokenFields
        }
        isStable
        reserve0
        reserve1
        volumeToken0
        volumeToken1
        createdAtTimestamp
        createdAtBlockNumber
      }
      */
