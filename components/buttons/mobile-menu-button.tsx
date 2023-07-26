"use client";

import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useMobileNavDrawer } from "@/hooks/use-mobile-nav-drawer";

const MobileMenuButton = () => {
  const { onOpen } = useMobileNavDrawer();

  return (
    <Button
      size="icon"
      variant="outline"
      className="w-[36px] h-[36px] mr-3 sm:hidden"
      onClick={onOpen}
    >
      <MenuIcon />
    </Button>
  );
};

export default MobileMenuButton;
