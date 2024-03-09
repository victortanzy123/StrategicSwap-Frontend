"use client";
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
  Heading,
  Divider,
  Icon,
} from "@chakra-ui/react";
import React from "react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { MdErrorOutline } from "react-icons/md";
import {
  CommonState,
  StrategicPairDetails,
  DepositLiquidityState,
} from "@/utils/helpers/types";

// Hooks
import { DepositTransactionState } from "@/hooks/web3/useDepositLiquidity";

// Components
import LoadingStepper from "../spinners/LoadingStepper";

type LiquidityDepositModalProps = {
  data: StrategicPairDetails;
  depositTransactionState: DepositTransactionState;
  depositState: DepositLiquidityState;
  isOpen: boolean;
  toggleOpen: () => void;
};
const DEFAULT_MODAL_BORDER_RADIUS = ["2.5rem", null, null, "2.5rem"];

function getTopIconDisplay(state: CommonState): React.ReactNode {
  switch (state) {
    case CommonState.COMPLETED:
      return <CheckCircleIcon boxSize="4rem" color={"white"} />;

    case CommonState.FAILED:
      return <Icon as={MdErrorOutline} boxSize="4rem" color={"white"} />;

    default:
      return <></>;
  }
}
function LiquidityDepositModal({
  isOpen,
  toggleOpen,
  data,
  depositTransactionState,
}: LiquidityDepositModalProps) {
  const header = "LIQUIDITY PROVISION STATUS";
  const text = "Complete the following transactions to provide liquidity.";

  // States
  const completed =
    depositTransactionState.approveToken0 === CommonState.COMPLETED &&
    depositTransactionState.approveToken1 === CommonState.COMPLETED &&
    depositTransactionState.deposit === CommonState.COMPLETED;

  const failed =
    depositTransactionState.approveToken0 === CommonState.FAILED &&
    depositTransactionState.approveToken1 === CommonState.FAILED &&
    depositTransactionState.deposit === CommonState.FAILED;
  console.log("See here", completed, failed);
  const loading = !completed && !failed;

  return (
    <Modal
      isOpen={isOpen}
      onClose={toggleOpen}
      size={["full", "lg"]}
      isCentered
    >
      <ModalOverlay />
      <ModalContent bg={"#1A1D26"} borderRadius={DEFAULT_MODAL_BORDER_RADIUS}>
        <ModalCloseButton right={5} top={5} color={"white"} />
        <ModalBody
          paddingTop="4rem"
          paddingBottom="2rem"
          paddingX="1rem"
          bg={"main.dark"}
          borderRadius={DEFAULT_MODAL_BORDER_RADIUS}
        >
          <Flex flexDirection={"column"} height={["90vh", "inherit"]}>
            <Box my={"2rem"} flexGrow={1}>
              <VStack spacing={"2rem"}>
                {getTopIconDisplay(
                  loading
                    ? CommonState.LOADING
                    : completed
                    ? CommonState.COMPLETED
                    : CommonState.FAILED
                )}
                <Heading
                  paddingTop="1rem"
                  fontWeight={400}
                  letterSpacing={"0.06em"}
                  textTransform={"uppercase"}
                  textAlign="center"
                  fontSize={["4xl", "3xl"]}
                  textColor={"white"}
                >
                  {header}
                </Heading>
                <Text
                  fontSize={["xl", "lg"]}
                  textAlign={"center"}
                  textColor={"white"}
                >
                  {failed ? "Transaction failed, please re-try again." : text}
                </Text>
              </VStack>
            </Box>
            {failed ? (
              <></>
            ) : (
              <>
                <LoadingStepper
                  isLoad={
                    depositTransactionState.approveToken0 ===
                    CommonState.COMPLETED
                  }
                  instruction={`Setting Approval For ${data.token0.name}`}
                />
                <LoadingStepper
                  isLoad={
                    depositTransactionState.approveToken1 ===
                    CommonState.COMPLETED
                  }
                  instruction={`Setting Approval For ${data.token1.name}`}
                />
                <LoadingStepper
                  isLoad={
                    depositTransactionState.deposit === CommonState.COMPLETED
                  }
                  instruction={`Deposit Liquidity`}
                />
              </>
            )}
            <Divider my={"1rem"} />
            {completed && (
              <Button
                variant="solid"
                onClick={toggleOpen}
                fontWeight={400}
                letterSpacing={"0.06em"}
                textTransform={"uppercase"}
                my={["0.5rem", 0]}
                width={["full", "auto"]}
                textColor={"white"}
              >
                Completed
              </Button>
            )}
            {loading && (
              <Button
                size="lg"
                margin="1rem"
                variant="solid"
                isDisabled
                fontWeight={400}
                letterSpacing={"0.06em"}
                textTransform={"uppercase"}
                textColor={"white"}
              >
                Loading...
              </Button>
            )}
            {failed && (
              <Button
                size="lg"
                margin="1rem"
                fontWeight={400}
                letterSpacing={"0.06em"}
                textTransform={"uppercase"}
                variant="solid"
                bg={"gray.700"}
                onClick={toggleOpen}
              >
                <Text variant="strong" textColor={"white"}>
                  Okay, I understand
                </Text>
              </Button>
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default LiquidityDepositModal;
