import gql from "graphql-tag";
import { TOKEN_FIELD } from "../fragments";

export function profileTransactionsQuery() {
  return gql`
    ${TOKEN_FIELD}
    query ProfileTransactions(
      $first: Int
      $skip: Int
      $orderDirection: String
      $orderBy: String
      $types: [String]
      $user: String
    ) {
      data: transactions(
        first: $first
        skip: $skip
        orderDirection: $orderDirection
        orderBy: $orderBy
        where: { or: [{ from: $user }, { to: $user }] }
      ) {
        id
        pair {
          id
          totalSupply
          reserve0
          reserve1
          isStable
          token0 {
            ...TokenFields
          }
          token1 {
            ...TokenFields
          }
        }
        timestamp
        type
        to
        from
        amount0In
        amount1In
        amount0Out
        amount1Out
        amountUSD
      }
    }
  `;
}
