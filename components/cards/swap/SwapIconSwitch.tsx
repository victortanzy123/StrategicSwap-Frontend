"use client";
import { IconButton } from "@chakra-ui/react";
import { FaArrowDown } from "react-icons/fa";
import React, { memo } from "react";

type SwapIconSwitchProps = {
  callback: () => void;
};

function SwapIconSwitch({ callback }: SwapIconSwitchProps) {
  return (
    <IconButton
      aria-label="switch-icon"
      //   borderRadius={"full"}
      height={"2rem"}
      width={"2rem"}
      //   my={"-12px"}
      position={"relative"}
      border={"4px solid rgb(255, 255, 255)"}
      backgroundColor={"rgb(246, 245, 250)"}
      transform={"rotate(0deg)"}
      transition={"transform 0.3s ease 0s"}
      _hover={{
        transform: "rotate(180deg)",
      }}
      icon={<FaArrowDown color="black" />}
      onClick={callback}
    />
  );
}

export default memo(SwapIconSwitch);
