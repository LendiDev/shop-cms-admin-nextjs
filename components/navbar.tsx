import { SignedIn, UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { MainNav } from "@/components/main-nav";
import { StoreSwitcher } from "@/components/store-switcher";
import prismadb from "@/lib/prismadb";
import MobileMenuButton from "./buttons/mobile-menu-button";

const Navbar = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/login");
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 sm:px-6">
        <MobileMenuButton />
        <StoreSwitcher items={stores} />
        <MainNav className="px-2" />
        <div className="ml-auto flex items-center">
          <SignedIn>
            <UserButton afterSignOutUrl="/signout" />
          </SignedIn>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
