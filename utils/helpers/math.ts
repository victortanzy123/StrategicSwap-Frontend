import { BigNumber } from "bignumber.js";

export type EthereumUnit = "wei" | "gwei" | "ether" | "mwei";

export function isHexString(value: string, length?: number): boolean {
  if (typeof value !== "string" || !value.match(/^0x[0-9A-Fa-f]*$/))
    return false;

  if (
    typeof length !== "undefined" &&
    length > 0 &&
    value.length !== 2 + 2 * length
  )
    return false;

  return true;
}

const unitMap = {
  wei: "1",
  mwei: "1000000",
  gwei: "1000000000",
  ether: "1000000000000000000",
};

export const DecimalUnitMap = {
  1: "wei",
  6: "mwei",
  9: "gwei",
  18: "ether",
};

export function fromWei(
  amount: string | number | BigNumber,
  unit: EthereumUnit = "ether"
): string {
  const bn = toBigNumber(amount);
  const value = bn.div(new BigNumber(unitMap[unit]));
  return value.toString();
}

export function toWei(
  amount: string | number | BigNumber,
  unit: EthereumUnit = "ether"
): string {
  const bn = toBigNumber(amount);
  const value = bn.multipliedBy(new BigNumber(unitMap[unit]));
  return value.toString();
}

export function toBigNumber(value: string | number | BigNumber) {
  let bn: BigNumber;
  if (typeof value === "string") {
    bn = new BigNumber(value, isHexString(value) ? 16 : 10);
  } else {
    bn = new BigNumber(value);
  }
  return bn;
}

export function intToHex(value: number): string {
  return `0x${Number(value).toString(16)}`;
}

export function toHex(value: string): string {
  return `0x${Number(value).toString(16)}`;
}

export function safeDiv(x: number, y: number): number {
  if (y === 0) return 0;
  return x / y;
}

// Web3 AMM Math
export function calcCorTokenDepositAmount(
  inputTokenIndex: 0 | 1,
  amount: number,
  reserve0: number,
  reserve1: number
): {
  token0Amount: number;
  token1Amount: number;
} {
  const ratio = safeDiv(reserve0, reserve1);

  return inputTokenIndex === 0
    ? { token0Amount: amount, token1Amount: amount / ratio }
    : {
        token0Amount: ratio * amount,
        token1Amount: amount,
      };
}

export function calcTokensOutputFromLpTokenAmount(
  lpTokenAmount: number,
  totalSupply: number,
  reserve0: number,
  reserve1: number
): {
  token0Amount: number;
  token1Amount: number;
} {
  const stakeProportion = safeDiv(lpTokenAmount, totalSupply);
  return {
    token0Amount: stakeProportion * reserve0,
    token1Amount: stakeProportion * reserve1,
  };
}
