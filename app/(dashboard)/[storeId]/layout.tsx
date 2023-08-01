import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";
import Navbar from "@/components/navbar";

const getStore = async (id: string, userId: string) => {
  const store = await prismadb.store.findFirst({
    where: { userId, id },
  });
  return store;
};

export const revalidate = 0;

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

  const store = await getStore(params.storeId, userId);

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
