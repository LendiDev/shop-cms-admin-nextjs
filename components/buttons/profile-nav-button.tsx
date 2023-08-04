"use client";

import { SignedIn, UserButton } from "@clerk/nextjs";

const ProfileNavButton = () => {
  return (
    <div className="ml-auto flex items-center">
      <SignedIn>
        <UserButton afterSignOutUrl="/signout" />
      </SignedIn>
    </div>
  );
};

export default ProfileNavButton;
