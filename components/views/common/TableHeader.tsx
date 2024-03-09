"use client";
import React, { memo } from "react";
import { Heading } from "@chakra-ui/react";

type TableHeaderProps = {
  text: string;
  center?: boolean;
};
function TableHeader({ text, center = false }: TableHeaderProps) {
  return (
    <Heading
      width={"full"}
      fontWeight={"300"}
      textAlign={center ? "center" : "start"}
      textTransform={"uppercase"}
      letterSpacing={"0.06em"}
      mt={"1rem"}
      mb={"2rem"}
      textColor={"white"}
    >
      {text}
    </Heading>
  );
}

export default memo(TableHeader);
