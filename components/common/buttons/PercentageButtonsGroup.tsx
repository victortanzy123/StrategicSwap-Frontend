"use client";
import React from "react";
import { ButtonGroup, Button } from "@chakra-ui/react";

const DEFAULT_PERCENTAGE_OPTIONS: number[] = [25, 50, 75, 100];

type PercentageButtonsGroupProps = {
  callback: (percentageValue: number, ...args: any[]) => void;
};

function PercentageButtonsGroup({ callback }: PercentageButtonsGroupProps) {
  return (
    <>
      <ButtonGroup>
        {DEFAULT_PERCENTAGE_OPTIONS.map((percentage, i) => (
          <Button
            size={"sm"}
            key={i}
            variant={"outline"}
            colorScheme={"white"}
            onClick={() => callback(percentage)}
            textColor={"white"}
          >
            {percentage}%
          </Button>
        ))}
      </ButtonGroup>
    </>
  );
}

export default PercentageButtonsGroup;
