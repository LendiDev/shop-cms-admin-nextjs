import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import ApiList from "@/components/ui/api-list";
import BusProvider from "@/components/providers/bus-provider";
import BillboardModal from "./components/modals/size-modal";
import { SizeColumn } from "./components/table/columns";
import SizesClient from "./components/sizes-client";

interface SizesPageProps {
  params: { storeId: string };
}

const SizesPage: React.FC<SizesPageProps> = async ({ params }) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/login");
  }

  const sizes = await prismadb.size.findMany({
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

  const formattedSizes: SizeColumn[] = sizes.map(
    ({ id, name, value, createdAt }) => {
      return {
        id,
        name,
        value,
        createdAt: format(createdAt, "dd/MM/yy h:mmaaa"),
      };
    }
  );

  return (
    <>
      <BillboardModal />
      <BusProvider>
        <SizesClient sizes={sizes} tableData={formattedSizes} />
      </BusProvider>
      <ApiList entityName="sizes" entityIdName="sizeId" />
    </>
  );
};

export default SizesPage;
