import {
  DISPLAY_USD_DECIMALS,
  getDurationAgo,
  getMonthYearString,
  truncateAddress,
  truncateHexString,
} from "./misc";
import {
  TokenDetails,
  UserLiquidityPosition,
  StrategicPairDetails,
  FactoryStatistics,
  TransactionRecordDetails,
  ProfileTransactionRecordDetails,
  LiquidityPositionDetails,
  ProfileLPDetails,
} from "./types";

type FactoryPoolPairData = {
  factoryStats: FactoryStatistics;
  pairsData: Partial<StrategicPairDetails>[];
};

export function processFactoryPoolPairsData(
  rawData: any
): null | FactoryPoolPairData {
  if (!rawData) return null;

  const { strategicSwapFactory, pairs } = rawData;
  const { pairCount, totalFeeUSD, totalVolumeUSD } = strategicSwapFactory;

  let overallTvl = 0;

  const pairsData = pairs.map((pair: any) => {
    const {
      id,
      createdAtTimestamp,
      isStable,
      reserve0,
      reserve1,
      token0,
      token1,
      token0Fee,
      token1Fee,
      volumeToken0,
      volumeToken1,
    } = pair;
    const pairTvl = parseFloat(reserve0) + parseFloat(reserve1);
    overallTvl += pairTvl;
    const pairTotalVolume = parseFloat(volumeToken0) + parseFloat(volumeToken1);
    const pairTotalFee = parseFloat(token0Fee) + parseFloat(token1Fee);
    return {
      address: id,
      isStable,
      tvl: pairTvl,
      pairTotalVolume,
      pairTotalFee,
      token0: processTokenDetails(token0)!,
      token1: processTokenDetails(token1)!,
      createdAt: getMonthYearString(parseInt(createdAtTimestamp)),
    };
  });

  const factoryStats: FactoryStatistics = {
    pairCount,
    totalFeeUSD: parseFloat(totalFeeUSD),
    totalVolumeUSD: parseFloat(totalVolumeUSD),
    totalTvlUSD: overallTvl,
  };

  return {
    pairsData,
    factoryStats,
  };
}

export function processTokenDetails(rawData: any): TokenDetails | null {
  if (!rawData) return null;

  const {
    decimals,
    id,
    name,
    swapTxCount,
    symbol,
    totalLiquidityDeposited,
    tradeVolume,
  } = rawData;

  return {
    decimals: parseInt(decimals),
    address: id,
    name,
    symbol,
    swapTxCount: parseInt(swapTxCount),
    liquidityDeposited: parseFloat(totalLiquidityDeposited),
    tradeVolume: parseFloat(tradeVolume),
  };
}

export function processSinglePairData(
  rawData: any
): StrategicPairDetails | null {
  if (!rawData) return null;

  const {
    id,
    createdAtTimestamp,
    isStable,
    liquidityPositions,
    reserve0,
    reserve1,
    token0,
    token0Fee,
    token0FeePercent,
    token1,
    token1Fee,
    token1FeePercent,
    totalSupply,
    totalFeeGenerated,
    vault0,
    vault1,
    volumeToken0,
    volumeToken1,
  } = rawData;

  const timestamp = parseInt(createdAtTimestamp);

  const res: StrategicPairDetails = {
    createdAtTimestamp: timestamp,
    createdAt: getMonthYearString(timestamp),
    isStable,
    liquidityPositions: liquidityPositions.map(
      ({ user, lpTokenBalance }: { user: any; lpTokenBalance: string }) => ({
        lpTokenBalance: parseFloat(lpTokenBalance),
        user: user.id as string,
        pair: id,
      })
    ),
    reserve0: parseFloat(reserve0),
    reserve1: parseFloat(reserve1),
    tvl: parseFloat(reserve0) + parseFloat(reserve1),
    token0: processTokenDetails(token0)!,
    token1: processTokenDetails(token1)!,
    token0Fee: parseFloat(token0Fee),
    token1Fee: parseFloat(token1Fee),
    token0FeePercent: parseFloat(token0FeePercent),
    token1FeePercent: parseFloat(token1FeePercent),
    totalFee: parseFloat(token0Fee) + parseFloat(token1Fee),
    totalLpSupply: parseFloat(totalSupply),
    volumeToken0: parseFloat(volumeToken0),
    volumeToken1: parseFloat(volumeToken1),
    totalFeeGenerated: parseFloat(totalFeeGenerated),
    totalVolume: parseFloat(volumeToken0) + parseFloat(volumeToken1),
    vault0,
    vault1,
  };

  return res;
}

export function processPoolTransactionsData(
  rawData: any
): TransactionRecordDetails[] | null {
  if (!!!rawData || rawData?.length === 0) return null;

  const res = rawData.map((data: any) => {
    const {
      id,
      timestamp,
      type,
      to,
      from,
      amount0In,
      amount1In,
      amount0Out,
      amount1Out,
      amountUSD,
    } = data;

    return {
      hash: truncateHexString(id),
      timestamp: getDurationAgo(timestamp),
      type,
      to: truncateAddress(to),
      from: truncateAddress(from),
      amount0In: parseFloat(amount0In).toFixed(DISPLAY_USD_DECIMALS),
      amount1In: parseFloat(amount1In).toFixed(DISPLAY_USD_DECIMALS),
      amount0Out: parseFloat(amount0Out).toFixed(DISPLAY_USD_DECIMALS),
      amount1Out: parseFloat(amount1Out).toFixed(DISPLAY_USD_DECIMALS),
      amountUSD: parseFloat(amountUSD).toFixed(DISPLAY_USD_DECIMALS),
    };
  });

  return res;
}

export function processProfileTransactionsData(
  rawData: any
): ProfileTransactionRecordDetails[] | null {
  if (!!!rawData) return null;

  const res = rawData.map((data: any) => {
    const {
      id,
      pair,
      timestamp,
      type,
      to,
      from,
      amount0In,
      amount1In,
      amount0Out,
      amount1Out,
      amountUSD,
    } = data;
    const { totalSupply, reserve0, reserve1, isStable, token0, token1 } = pair;

    return {
      hash: truncateHexString(id),
      timestamp: getDurationAgo(timestamp),
      type,
      to: truncateAddress(to),
      from: truncateAddress(from),
      amount0In: parseFloat(amount0In).toFixed(DISPLAY_USD_DECIMALS),
      amount1In: parseFloat(amount1In).toFixed(DISPLAY_USD_DECIMALS),
      amount0Out: parseFloat(amount0Out).toFixed(DISPLAY_USD_DECIMALS),
      amount1Out: parseFloat(amount1Out).toFixed(DISPLAY_USD_DECIMALS),
      amountUSD: parseFloat(amountUSD).toFixed(DISPLAY_USD_DECIMALS),
      isStable,
      totalSupply: parseFloat(totalSupply),
      reserve0: parseFloat(reserve0),
      reserve1: parseFloat(reserve1),
      tvl: parseFloat(reserve0) + parseFloat(reserve1),
      token0: processTokenDetails(token0)!,
      token1: processTokenDetails(token1)!,
      pair: pair.id,
      pairName: `${token0.name}-${token1.name}`,
    };
  });

  return res;
}

export function processProfileLiquidityPositionsData(
  rawData: any
): ProfileLPDetails | null {
  if (!!!rawData) return null;

  const liquidityPositions: LiquidityPositionDetails[] = rawData.map(
    (data: any) => {
      const { user, pair, lpTokenBalance } = data;
      const { token0, token1, reserve0, reserve1, isStable, totalSupply } =
        pair;

      const userStakePorportion =
        parseFloat(lpTokenBalance) / parseFloat(totalSupply);
      return {
        user: user.id,
        pair: pair.id,
        pairName: `${token0.name}-${token1.name}`,
        reserve0: parseFloat(reserve0),
        reserve1: parseFloat(reserve1),
        token0Stake: userStakePorportion * parseFloat(reserve0),
        token1Stake: userStakePorportion * parseFloat(reserve1),
        tvl: parseFloat(reserve0) + parseFloat(reserve1),
        isStable,
        lpTokenBalance: parseFloat(lpTokenBalance),
        totalSupply: parseFloat(totalSupply),
      } as LiquidityPositionDetails;
    }
  );

  const profileTotalVolume =
    liquidityPositions.length > 0
      ? parseFloat(rawData[0].user.totalSwappedVolumeUSD)
      : 0;
  const profileTvl = liquidityPositions.reduce(
    (acc: number, lpData: LiquidityPositionDetails) =>
      acc + lpData.token0Stake + lpData.token1Stake,
    0
  );

  return {
    liquidityPositions,
    profileTotalVolume,
    profileTvl,
  };
}
