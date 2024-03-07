"use client";
import React, { memo } from "react";

function DualTabs({
  label1,
  label2,
  activeTab,
  setActiveTab,
}: {
  label1: string;
  label2: string;
  activeTab: number;
  setActiveTab: (tab: number) => void;
}) {
  const activeStyle =
    "bg-blue-700 h-10 rounded-full flex items-center cursor-pointer w-1/2 justify-center text-white";
  const inactiveStyle =
    "h-full rounded-full flex items-center cursor-pointer w-1/2 justify-center text-red-light-medium";
  return (
    <div className="flex bg-blue-300 justify-center items-center rounded-full h-12 text-sm  py-2 px-1 mt-4">
      <div
        className={activeTab === 0 ? activeStyle : inactiveStyle}
        onClick={() => setActiveTab(0)}
      >
        {label1}
      </div>
      <div
        className={activeTab === 1 ? activeStyle : inactiveStyle}
        onClick={() => setActiveTab(1)}
      >
        {label2}
      </div>
    </div>
  );
}

export default memo(DualTabs);
