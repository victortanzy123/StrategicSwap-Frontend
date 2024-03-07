import gql from "graphql-tag";

export function poolPairTransactionsQuery() {
  return gql`
    query PoolPairTransactions(
      $first: Int
      $skip: Int
      $orderDirection: String
      $orderBy: String
      $types: [String]
      $id: String
    ) {
      data: transactions(
        first: $first
        skip: $skip
        orderDirection: $orderDirection
        orderBy: $orderBy
        where: { pair: $id }
      ) {
        id
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
