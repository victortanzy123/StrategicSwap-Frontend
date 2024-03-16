"use client";

import Tag from "@/components/common/tag";
import NextLink from "next/link";
import { DISPLAY_USD_DECIMALS } from "@/utils/helpers/misc";
import {
  CommonSize,
  StrategicPairDetails,
  SwapMode,
} from "@/utils/helpers/types";
import Image from "next/image";
import { memo } from "react";
import { DEFAULT_CHAIN_DETAILS } from "@/utils/helpers/web3";
import { PoolConfigModel } from "@/utils/constants/pool-configs";

type PoolCardProps = {
  data: Partial<StrategicPairDetails>;
  poolConfigData: PoolConfigModel;
  loading: boolean;
};

function PoolCard({ data, poolConfigData, loading }: PoolCardProps) {
  if (!data) return <></>;
  const { token0, token1, name, yieldPercentage } = poolConfigData;
  const swapMode = data.isStable ? SwapMode.STABLE : SwapMode.VOLATILE;
  return (
    <NextLink href={`/market/${data?.address}`}>
      <div
        className={`relative group border-transparent bg-gradient-to-t from-blue-900 via-blue-800 to-blue-600 bg-opacity-10 cursor-pointer shadow-md hover:transform hover:-translate-y-2 hover:shadow-lg transition-transform duration-300 rounded-lg p-6 w-80 h-60`}
      >
        <div className="border-4 border-blue-600 absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className={"h-full w-full"}>
          <div className={"flex  items-center"}>
            <Image
              src={token0.image}
              width={50}
              height={50}
              alt="icon"
              className="mr-2"
            />
            <Image
              src={token1.image}
              width={50}
              height={50}
              alt="icon"
              className="mr-2"
            />
            <div className="flex flex-col font-display text-xl  text-white">
              {name}
              <p className="text-sm italic text-white font-body">
                {DEFAULT_CHAIN_DETAILS.chain}
              </p>
            </div>
          </div>
          <div className={"flex mt-4 items-center justify-between"}>
            <span className={"mr-4 text-teal-100"}> 5.00% p.a</span>
            <Tag content={swapMode} size={CommonSize.md} />
          </div>
          <div className={"flex mt-1"}>
            <h2 className={"!important mr-2 text-white text-2xl"}>
              ${data?.tvl!.toFixed(DISPLAY_USD_DECIMALS)}
            </h2>
            <span className={`text-2xl font-thin text-white`}>TVL</span>
          </div>

          <div className={"flex flex-col mt-2 flex-1"}>
            <span className={"uppercase font-thin text-white"}>
              Strategies:
            </span>
            <div className={"flex mt-3"}>
              <div className={"mr-2"}>
                <Tag content={"sDai"} />
              </div>
              <div className={"ml-2"}>
                <Tag content={"FUSDC"} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </NextLink>
  );
}

export default memo(PoolCard);
