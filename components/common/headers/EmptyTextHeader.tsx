import React, { memo } from "react";
import { Heading } from "@chakra-ui/react";

type EmptyTextHeaderProps = {
  minimised?: boolean;
  text: string;
};

function EmptyTextHeader({ text, minimised = false }: EmptyTextHeaderProps) {
  const MARGIN_TOP = minimised ? "2rem" : "6rem";
  return (
    <Heading
      variant={"loud"}
      fontSize={"1xl"}
      mt={MARGIN_TOP}
      width={"full"}
      display={"flex"}
      textAlign={"center"}
      justifyContent={"center"}
    >
      {text}
    </Heading>
  );
}

export default memo(EmptyTextHeader);
