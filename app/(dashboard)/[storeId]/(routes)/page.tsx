import prismadb from "@/lib/prismadb";
import React, { useEffect } from "react";

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

  return <div>Active store is {store?.name}</div>;
};

export default DashboardPage;
