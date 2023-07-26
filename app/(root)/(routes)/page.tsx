"use client";

import { useEffect } from "react";

import { useStoreModal } from "@/hooks/use-store-modal";

const SetupPage = () => {
  const onOpen = useStoreModal((store) => store.onOpen);
  const isOpen = useStoreModal((store) => store.isOpen);

  useEffect(() => {
    onOpen();
  }, [onOpen, isOpen]);

  return null;
};

export default SetupPage;
