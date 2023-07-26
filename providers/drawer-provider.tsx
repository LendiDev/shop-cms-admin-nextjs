"use client";

import MobileNavDrawer from "@/components/drawers/mobile-nav-drawer";
import { useMounted } from "@/hooks/use-mounted";

export const ModalProvider = () => {
  const { isMounted } = useMounted();

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <MobileNavDrawer />
    </>
  );
};
