"use client";
import { Flex, Text, Spinner } from "@chakra-ui/react";
import React from "react";

// Components
import { FaCheck } from "react-icons/fa";
type LoadingStepperProps = {
  isLoad: boolean;
  instruction: string;
};

function LoadingStepper({ isLoad, instruction }: LoadingStepperProps) {
  console.log("SEE IS LOAD:", isLoad);
  return (
    <Flex
      position={"relative"}
      width={"100%"}
      alignItems={"center"}
      py={"0.5rem"}
      px={"1rem"}
      height={"5rem"}
    >
      <Text
        textAlign={"start"}
        fontSize={"lg"}
        fontWeight={300}
        letterSpacing={"0.03em"}
        textTransform={"uppercase"}
      >
        {instruction}
      </Text>
      <Flex flexGrow={1} justifyContent={"flex-end"} px={"1rem"}>
        {isLoad ? (
          <FaCheck size={"3rem"} style={{ color: "green" }} />
        ) : (
          <Spinner height={"3rem"} width={"3rem"} />
        )}
      </Flex>
    </Flex>
  );
}

export default LoadingStepper;
