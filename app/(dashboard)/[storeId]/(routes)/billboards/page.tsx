import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import BillboardsGallery from "./components/billboards-client";
import prismadb from "@/lib/prismadb";
import ApiList from "@/components/ui/api-list";
import BillboardModal from "./components/modals/billboard-modal";

interface BillboardsPageProps {
  params: { storeId: string; billboardId: string };
}

const BillboardsPage: React.FC<BillboardsPageProps> = async ({ params }) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/login");
  }

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
      store: {
        userId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <BillboardModal />
      <BillboardsGallery billboards={billboards} />
      <ApiList entityName="billboards" entityIdName="billboardId" />
    </>
  );
};

export default BillboardsPage;
