import { gql } from "@apollo/client";

export const ROYALTIES_FIELD = gql`
  fragment RoyaltiesFields on RoyaltyConfig {
    id
    bps
    receiver
  }
`;

export const FACTORY_STATISTICS_FIELD = gql`
  fragment FactoryStatisticsFields on StrategicSwapFactory {
    pairCount
    totalVolumeUSD
    totalFeeUSD
  }
`;

export const TOKEN_FIELD = gql`
  fragment TokenFields on Token {
    id
    name
    symbol
    decimals
    tradeVolume
    swapTxCount
    totalLiquidityDeposited
  }
`;

export const LIQUIDITY_POSITION_FIELDS = gql`
  fragment LiquidityPositionFields on LiquidityPosition {
    id
    user {
      id
    }
    lpTokenBalance
  }
`;
