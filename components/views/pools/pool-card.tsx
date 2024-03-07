"use client";

import Tag from "@/components/common/tag";
import NextLink from "next/link";
import { DISPLAY_USD_DECIMALS } from "@/utils/helpers/misc";
import {
  CommonSize,
  StrategicPairDetails,
  SwapMode,
} from "@/utils/helpers/types";
import { Flex } from "@chakra-ui/react";
import Image from "next/image";
import { memo } from "react";

type PoolCardProps = {
  data: Partial<StrategicPairDetails>;
  loading: boolean;
};

function PoolCard({ data, loading }: PoolCardProps) {
  console.log("SEE POOL CARD", data);
  if (!data) return <></>;
  const poolName = `${data?.token0!.name}-${data?.token1!.name}`;
  const swapMode = data.isStable ? SwapMode.STABLE : SwapMode.VOLATILE;
  return (
    <NextLink href={`/pool-pair/${data?.address}`}>
      <div
        className={`relative group border-transparent bg-gradient-to-t from-blue-900 via-blue-800 to-blue-600 bg-opacity-10 cursor-pointer shadow-md hover:transform hover:-translate-y-2 hover:shadow-lg transition-transform duration-300 rounded-lg p-6 w-80 h-60`}
      >
        <div className="border-4 border-blue-600 absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className={"h-full w-full"}>
          <div className={"flex justify-between items-center"}>
            <h2 className={"tracking-wider text-3xl mb-1"}>{poolName}</h2>
            <Tag content={swapMode} size={CommonSize.md} />
          </div>
          <div className={"flex mt-4"}>
            <span className={"mr-4 text-teal-100"}> 5.00% p.a</span>
            <Image
              src={"/vercel.svg"}
              alt={"lighting"}
              width={100}
              height={50}
            />
          </div>
          <div className={"flex mt-1"}>
            <h2 className={"!important mr-2"}>
              ${data?.tvl!.toFixed(DISPLAY_USD_DECIMALS)}
            </h2>
            <span className={`text-md font-thin`}>TVL</span>
          </div>

          <div className={"flex flex-col mt-5 flex-1"}>
            <span className={"uppercase font-thin"}>Strategies:</span>
            <div className={"flex"}>
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
