"use client";

import { useRouter } from "next/navigation";

const SignOut = () => {
  const router = useRouter();

  router.replace("/");

  return null;
};

export default SignOut;
