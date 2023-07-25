import { UserButton } from "@clerk/nextjs";
import { MainNav } from "@/components/main-nav";
import StoreSwitcher from "./store-switcher";

const Navbar = () => {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-6">
        <StoreSwitcher />
        <MainNav className="px-4" />
        <div className="ml-auto flex items-center">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
