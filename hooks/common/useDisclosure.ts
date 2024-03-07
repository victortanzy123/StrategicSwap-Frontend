"use client";
import { useCallback, useState } from "react";

export type UseDisclosureProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onToggle: () => void;
};

function useDisclosure(): UseDisclosureProps {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onOpen = useCallback(() => {
    setIsOpen(() => true);
  }, []);

  const onClose = useCallback(() => {
    setIsOpen(() => false);
  }, []);

  const onToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return { isOpen, onOpen, onClose, onToggle };
}

export default useDisclosure;
