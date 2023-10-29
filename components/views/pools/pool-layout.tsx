"use client";
import { memo } from "react";
import PoolCard from "./pool-card";

function PoolLayout() {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 justify-items-center xl:grid-cols-4 gap-x-8 gap-y-14`}
    >
      {[1, 2, 3].map((pool, i) => (
        <PoolCard key={i} />
      ))}
    </div>
  );
}

export default memo(PoolLayout);
