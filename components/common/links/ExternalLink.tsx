import { Link as ChakraLink, Text } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { memo } from "react";

type ExternalLinkProps = {
  href: string;
  text?: string;
  icon?: boolean;
  bold?: boolean;
  variant?: string;
};

function ExternalLink({
  href,
  text = "",
  icon = true,
  bold = false,
  variant = "",
}: ExternalLinkProps) {
  return (
    <ChakraLink
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whiteSpace={"nowrap"}
      display="flex"
      justifyContent={"center"}
      alignItems="center"
      fontWeight={bold ? "bold" : "light"}
      fontSize={["xs", "sm", "xl"]}
    >
      <Text variant={variant}>{text}</Text>
      {icon ? <ExternalLinkIcon ml={2} /> : <></>}
    </ChakraLink>
  );
}

export default memo(ExternalLink);
