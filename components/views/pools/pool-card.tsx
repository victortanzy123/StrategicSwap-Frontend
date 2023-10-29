"use client";

import { Tag } from "@/components/common/tag";
import { CommonSize, SwapMode } from "@/utils/helpers/types";
import Image from "next/image";
import { memo } from "react";

function PoolCard() {
  return (
    <div
      className={`relative group border-transparent bg-gradient-to-t from-blue-900 via-blue-800 to-blue-600 bg-opacity-10 cursor-pointer shadow-md hover:transform hover:-translate-y-2 hover:shadow-lg transition-transform duration-300 rounded-lg p-6 w-80 h-60`}
    >
      <div className="border-4 border-blue-600 absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className={"h-full w-full"}>
        <h2 className={"tracking-wider text-3xl mb-1"}>DAI-USDT Pool</h2>
        <Tag content={SwapMode.STABLE} size={CommonSize.md} />
        <div className={"flex mt-4"}>
          <span className={"mr-4 text-teal-100"}> 5.00% p.a</span>
          <Image src={"/vercel.svg"} alt={"lighting"} width={100} height={50} />
        </div>
        <div className={"flex mt-1"}>
          <h2 className={"!important mr-2"}>$10.00M</h2>
          <span className={`text-md font-thin`}>TVL</span>
        </div>

        <div className={"w-half flex justify-between align-middle mt-5"}>
          <span className={"uppercase font-thin"}>Strategies:</span>
          <Tag content={"Savings Dai"} />
          <Tag content={"Flux USDC"} />
        </div>
      </div>
    </div>
  );
}

export default memo(PoolCard);
