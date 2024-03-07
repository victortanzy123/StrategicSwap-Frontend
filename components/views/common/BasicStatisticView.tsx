"use client";
import React, { memo } from "react";
import { Flex, Stat, Skeleton, StatLabel, StatNumber } from "@chakra-ui/react";
import Tag from "@/components/common/tag";
import { CommonSize } from "@/utils/helpers/types";

export enum ViewType {
  STATISTIC = "STATISTIC",
  TAG = "TAG",
}
type StatisticViewProps = {
  headerText: string;
  displayValue: string | number | null;
  decimals?: number;
  currency?: string;
  loading: boolean;
  largeMode?: boolean;
  type?: ViewType;
};
function BasicStatisticView({
  headerText,
  displayValue,
  decimals = 0,
  currency = "",
  loading,
  largeMode = false,
  type = ViewType.STATISTIC,
}: StatisticViewProps) {
  return (
    <Flex justifyContent={"center"} alignItems={"center"}>
      <Stat
        p={["0.1rem", "0.1rem", "0.2rem"]}
        display={"flex"}
        justifyContent={"center"}
      >
        <Skeleton isLoaded={!loading}>
          <StatLabel
            width={"full"}
            textAlign={"center"}
            mb={1.5}
            fontSize={largeMode ? ["2xl"] : ["xs", "sm", "md"]}
            textTransform={"uppercase"}
          >
            {headerText}
          </StatLabel>
        </Skeleton>
        <Skeleton isLoaded={!loading}>
          {type === ViewType.STATISTIC ? (
            <StatNumber
              display={"flex"}
              justifyContent={"center"}
              fontSize={largeMode ? ["4xl"] : ["xs", "sm", "xl"]}
            >
              {decimals > 0
                ? parseFloat(
                    (displayValue ? (displayValue as number) : 0).toString()
                  ).toFixed(decimals)
                : (displayValue as number) ?? 0}{" "}
              {currency}
            </StatNumber>
          ) : (
            <Tag content={displayValue as string} size={CommonSize.lg} />
          )}
        </Skeleton>
      </Stat>
    </Flex>
  );
}

export default memo(BasicStatisticView);
