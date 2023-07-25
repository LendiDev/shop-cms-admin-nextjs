"use client";

import { useEffect } from "react";

import { useStoreModal } from "@/hooks/use-store-modal";

const SetupPage = () => {
  const onOpen = useStoreModal((store) => store.onOpen);
  const isOpen = useStoreModal((store) => store.isOpen);
  const isForceClose = useStoreModal((store) => store.isForceClose);

  useEffect(() => {
    if (!isOpen && !isForceClose) {
      onOpen();
    }
  }, [isOpen, onOpen, isForceClose]);

  return null;
};

export default SetupPage;
