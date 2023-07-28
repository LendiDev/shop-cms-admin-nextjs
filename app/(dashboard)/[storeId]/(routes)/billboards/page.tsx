import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import BillboardsGallery from "./components/billboards-gallery";
import prismadb from "@/lib/prismadb";

interface BillboardsPageProps {
  params: { storeId: string };
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
  });

  return (
    <>
      <BillboardsGallery billboards={billboards} />
    </>
  );
};

export default BillboardsPage;
