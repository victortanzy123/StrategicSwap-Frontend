"use client";
import { CommonSize } from "@/utils/helpers/types";
import { memo } from "react";

export function Tag({
  content,
  size = CommonSize.xs,
}: {
  content: string;
  size?: CommonSize;
}) {
  return (
    <span
      className={`bg-white uppercase text-${size} py-1 px-2 rounded-md w-fit bg-opacity-10`}
    >
      {content}
    </span>
  );
}

export default memo(Tag);
