import prismadb from "@/lib/prismadb";
import React from "react";

import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";
export const revalidate = 2;

const getStore = async (id: string) => {
  const store = await prismadb.store.findFirst({
    where: {
      id,
    },
  });
  return store;
};

const DashboardPage: React.FC<{
  params: {
    storeId: string;
  };
}> = async ({ params }) => {
  const store = await getStore(params.storeId);

  return (
    <>
      <Heading title="Overview" subtitle={store?.name} />
      <Separator className="my-3" />
    </>
  );
};

export default DashboardPage;
