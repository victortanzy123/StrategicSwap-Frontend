"use client";
import { CommonSize } from "@/utils/helpers/types";
import { memo } from "react";

function Tag({
  content,
  size = CommonSize.xs,
}: {
  content: string;
  size?: CommonSize;
}) {
  return (
    <span
      className={`bg-white uppercase text-${size} text-white py-1 px-2 rounded-md w-fit bg-opacity-10 whitespace-nowrap`}
    >
      {content}
    </span>
  );
}

export default memo(Tag);
