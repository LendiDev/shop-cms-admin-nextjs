import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import BillboardsGallery from "./components/billboards-gallery";
import prismadb from "@/lib/prismadb";
import ApiList from "@/components/ui/api-list";
import BillboardModal from "./components/modals/billboard-modal";
import { Suspense } from "react";
import Loading from "./loading";

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
      <Suspense fallback={<Loading />}>
        <BillboardsGallery billboards={billboards} />
        <ApiList entityName="billboards" entityIdName="billboardId" />
      </Suspense>
    </>
  );
};

export default BillboardsPage;
