"use client";
import React, { memo } from "react";
import { Flex, Text, Tooltip } from "@chakra-ui/react";
import { QuestionIcon } from "@chakra-ui/icons";

type ApyViewProps = {
  apyType: string;
  hoverText: string;
  yieldPercentage: number;
};
function ApyView({ apyType, hoverText, yieldPercentage }: ApyViewProps) {
  return (
    <Flex width={"full"} justifyContent={"space-between"} alignItems={"center"}>
      {" "}
      <Text
        textTransform={"uppercase"}
        fontWeight={300}
        fontSize={"md"}
        letterSpacing={"0.06em"}
      >
        {apyType} APY:{" "}
      </Text>
      <Text
        textTransform={"uppercase"}
        fontWeight={300}
        fontSize={"md"}
        letterSpacing={"0.06em"}
      >
        {yieldPercentage.toFixed(2)}%
        <Tooltip label={hoverText} hasArrow>
          <QuestionIcon mx={"0.5rem"} />
        </Tooltip>
      </Text>
    </Flex>
  );
}

export default memo(ApyView);
