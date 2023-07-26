import prismadb from "@/lib/prismadb";
import React from "react";

import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

const DashboardPage: React.FC<{
  params: {
    storeId: string;
  };
}> = async ({ params }) => {
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
    },
  });

  return (
    <>
      <Heading title="Overview" subtitle={store?.name} />
      <Separator className="my-3" />
    </>
  );
};

export default DashboardPage;
