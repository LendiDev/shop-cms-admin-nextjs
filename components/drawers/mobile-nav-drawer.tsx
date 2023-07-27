"use client";

import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useMobileNavDrawer } from "@/hooks/use-mobile-nav-drawer";
import { getNavRoutes } from "@/components/main-nav";

const MobileNavDrawer = () => {
  const { isOpen, onClose } = useMobileNavDrawer();

  const pathname = usePathname();
  const params = useParams();

  const routes = getNavRoutes(params, pathname);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[236px] fill">
        <SheetHeader>
          <SheetTitle className="text-2xl self-start">Navigation</SheetTitle>
          <div className="self-start w-full">
            <ul className={cn("mt-5 flex flex-col items-start space-y-4")}>
              {routes.map((route) => (
                <li className="w-full" key={route.href}>
                  <Link
                    onClick={() => {
                      onClose();
                    }}
                    href={route.href}
                    className={cn(
                      "text-xl font-medium h-8 transition-colors hover:text-primary flex items-center",
                      route.active
                        ? "text-black dark:text-white"
                        : "text-muted-foreground "
                    )}
                  >
                    {route.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavDrawer;
