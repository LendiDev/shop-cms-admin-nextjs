import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";
import Navbar from "@/components/navbar";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const { userId } = auth();

  if (!userId) {
    redirect("/login");
  }

  const store = await prismadb.store.findFirst({
    where: { userId, id: params.storeId },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <>
      <Navbar />
      <div className="my-6 px-4 sm:px-6">{children}</div>
    </>
  );
}
