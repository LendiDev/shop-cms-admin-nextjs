import { SignedIn, UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { MainNav } from "@/components/main-nav";
import { StoreSwitcher } from "@/components/store-switcher";
import prismadb from "@/lib/prismadb";
import MobileMenuButton from "./buttons/mobile-menu-button";
import ProfileNavButton from "./buttons/profile-nav-button";

const getStores = async (userId: string) => {
  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  return stores;
};

const Navbar = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/login");
  }

  const stores = await getStores(userId);

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 sm:px-6">
        <MobileMenuButton />
        <StoreSwitcher items={stores} />
        <MainNav className="px-2" />
        <ProfileNavButton />
      </div>
    </div>
  );
};

export default Navbar;
