import { Contract, GasCostParameters, Result } from "ethers";
import { StaticImageData } from "next/image";

export enum CommonSize {
  xs = "xs",
  sm = "sm",
  md = "md",
  lg = "lg",
  xl = "xl",
}

export type TransactionType = "MINT" | "BURN" | "SWAP" | "APPROVE";

export enum SwapMode {
  VOLATILE = "VOLATILE",
  STABLE = "STABLE",
}

export type TokenMetadata = {
  name: string;
  image: StaticImageData | string;
  address: string;
  decimals: number;
};

export type ChainDetails = {
  id: number;
  hexId: string;
  currencyCode: string;
  decimals: number;
  logoPath: string;
  chainCode: string;
  subgraphChainCode: string;
  chain: string;
  factory: string;
  rpcNode: string;
  explorerLinkPrefix: string;
};

export type Currency = "USD" | "ETH";

export type BigValueType = BigInt | string;

export type TransactionCall = (
  contract: Contract,
  gasData?: GasCostParameters
) => Promise<Result>;

// Information
type ProcessedTokenState = {
  address: string;
  balance: string | number;
};

export type DepositLiquidityState = {
  token0Amount: number;
  token1Amount: number;
};

export type WithdrawLiquidityState = {
  lpTokenToWithdraw: number;
  token0Redeemable: number;
  token1Redeemable: number;
};

export type AttributeType = string | string[];

export type UserTokensState = {
  token0: ProcessedTokenState;
  token1: ProcessedTokenState;
  lpToken: ProcessedTokenState;
};

export type PairReserves = {
  reserves0: string;
  reserves1: string;
  token0Percent?: number;
  token1Percent?: number;
};

export type UserLiquidityPosition = {
  lpTokenbalance: number;
  user: string;
  pair: string;
};

export type TokenDetails = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  liquidityDeposited: number;
  tradeVolume: number;
  swapTxCount: number;
};

export type StrategicPairDetails = {
  address?: string;
  createdAt: string;
  createdAtTimestamp: number;
  isStable: boolean;
  liquidityPositions: UserLiquidityPosition[];
  reserve0: number;
  reserve1: number;
  tvl: number;
  token0: TokenDetails;
  token1: TokenDetails;
  token0Fee: number;
  token1Fee: number;
  token0FeePercent: number;
  token1FeePercent: number;
  totalFee: number;
  totalLpSupply: number;
  volumeToken0: number;
  volumeToken1: number;
  totalVolume: number;
  totalFeeGenerated: number;
  vault0: string;
  vault1: string;
};

export type FactoryStatistics = {
  pairCount: number;
  totalFeeUSD: number;
  totalVolumeUSD: number;
  totalTvlUSD: number;
};

export type TransactionRecordDetails = {
  hash: string;
  timestamp: number;
  type: TransactionType;
  to: string;
  from: string;
  amount0In: number;
  amount1In: number;
  amount0Out: number;
  amount1Out: number;
  amountUSD: number;
};

export type ProfileTransactionRecordDetails = TransactionRecordDetails & {
  pair: string;
  isStable: boolean;
  reserve0: number;
  reserve1: number;
  tvl: number;
  totalSupply: number;
  token0: TokenDetails;
  token1: TokenDetails;
  pairName: string;
};

export type LiquidityPositionDetails = {
  user: string;
  pair: string;
  pairName: string;
  reserve0: number;
  reserve1: number;
  token0Stake: number;
  token1Stake: number;
  lpTokenBalance: number;
  tvl: number;
  isStable: boolean;
  totalSupply: number;
};

export type ProfileLPDetails = {
  liquidityPositions: LiquidityPositionDetails[];
  profileTotalVolume: number;
  profileTvl: number;
};

// Transaction States
export enum CommonState {
  NIL = "NIL",
  LOADING = "LOADING",
  FAILED = "FAILED",
  COMPLETED = "COMPLETED",
}

export type TransactionStatus = {
  state: CommonState;
  type: TransactionType;
  hash: string | "";
};
