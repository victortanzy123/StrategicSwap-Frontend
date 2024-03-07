import gql from "graphql-tag";
import { LIQUIDITY_POSITION_FIELDS, TOKEN_FIELD } from "../fragments";

export function strategicPoolPairQuery() {
  return gql`
    ${TOKEN_FIELD}
    ${LIQUIDITY_POSITION_FIELDS}
    query SingleStrategicPoolPair($id: String) {
      data: pair(id: $id) {
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
        totalFeeGenerated
        createdAtTimestamp
        createdAtBlockNumber
        liquidityPositions(first: 100) {
          ...LiquidityPositionFields
        }
      }
    }
  `;
}
