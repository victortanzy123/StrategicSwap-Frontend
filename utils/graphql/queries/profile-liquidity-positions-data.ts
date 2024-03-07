import gql from "graphql-tag";

export function profileLiquidityPositionsQuery() {
  return gql`
    query ProfileLiquidityPositions(
      $first: Int
      $skip: Int
      $orderDirection: String
      $orderBy: String
      $user: String
    ) {
      data: liquidityPositions(first: $first, where: { user: $user }) {
        id
        user {
          id
          totalSwappedVolumeUSD
        }
        pair {
          id
          isStable
          token0 {
            name
          }
          token1 {
            name
          }
          reserve0
          reserve1
          totalSupply
        }
        lpTokenBalance
      }
    }
  `;
}
