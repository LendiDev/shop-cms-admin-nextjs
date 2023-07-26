import { SignedIn, UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { MainNav } from "@/components/main-nav";
import { StoreSwitcher } from "@/components/store-switcher";
import prismadb from "@/lib/prismadb";

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
      <div className="flex h-16 items-center px-6">
        <StoreSwitcher items={stores} />
        <MainNav className="px-4" />
        <div className="ml-auto flex items-center">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
