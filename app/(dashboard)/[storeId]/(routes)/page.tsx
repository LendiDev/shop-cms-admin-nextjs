"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import React, { useEffect } from "react";

const DashboardPage: React.FC<{
  params: {
    storeId: string;
  };
}> = ({ params }) => {
  const onClose = useStoreModal((store) => store.onClose);

  useEffect(() => {
    onClose();
  }, [onClose]);

  return <div>{params.storeId}</div>;
};

export default DashboardPage;
