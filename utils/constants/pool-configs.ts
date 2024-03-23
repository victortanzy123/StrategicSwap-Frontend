import { StaticImageData } from "next/image";
import { BigValueType, Currency, TokenMetadata } from "../helpers/types";
import DAI_LOGO from "@/public/logos/DAI-logo.png";
import USDC_LOGO from "@/public/logos/USDC-logo.svg";

export type PoolConfigModel = {
  id: number;
  name: string;
  token0: TokenMetadata;
  token1: TokenMetadata;
  stableMode: boolean;
  currency: Currency;
  image: StaticImageData | string;
  yieldPercentage: number;
  reserve0: BigValueType;
  reserve1: BigValueType;
  description: string;
};

export const DAI_USDC_POOL_METADATA: PoolConfigModel = {
  id: 0,
  name: "DAI-USDC Pool",
  stableMode: true,
  token0: {
    name: "DAI",
    image: DAI_LOGO,
    address: "0x",
    decimals: 18,
  },
  token1: {
    name: "USDC",
    image: USDC_LOGO,
    address: "0x",
    decimals: 18,
  },
  currency: "USD",
  image: DAI_LOGO,
  yieldPercentage: 5,
  reserve0: "10000000",
  reserve1: "10000000",
  description:
    "DAI-USDC Pool integrated with sDAI ERC-4626 Vault Strategy by Spark Protocol and fUSDC ERC-4626 Vault Streategy by Flux Finance.",
};
