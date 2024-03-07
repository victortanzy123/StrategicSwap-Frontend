"use client";
import { memo } from "react";

function PoolHeader() {
  return (
    <div className={`w-full text-center mt-5 mb-10`}>
      <div className={"w-100% text-6xl uppercase tracking-widest mb-5"}>
        Strategic Pool Pairs
      </div>
      <span>Find your market with the desired asset pair to trade!</span>
    </div>
  );
}

export default memo(PoolHeader);
