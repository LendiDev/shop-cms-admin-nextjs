import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import ApiList from "@/components/ui/api-list";
import BusProvider from "@/components/providers/bus-provider";
import BillboardModal from "./components/modals/category-modal";
import { CategoryColumn } from "./components/table/columns";
import CategoriesClient from "./components/categories-client";

interface CategoriesPageProps {
  params: { storeId: string; categoryId: string };
}

const CategoriesPage: React.FC<CategoriesPageProps> = async ({ params }) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/login");
  }

  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
      store: {
        userId,
      },
    },
    include: {
      billboard: {
        select: {
          label: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCategories: CategoryColumn[] = categories.map(
    ({ id, name, createdAt, billboard }) => {
      return {
        id,
        name,
        billboard: billboard?.label || "Not selected",
        createdAt: format(createdAt, "dd/MM/yy h:mmaaa"),
      };
    }
  );

  return (
    <>
      <BillboardModal />
      <BusProvider>
        <CategoriesClient
          categories={categories}
          tableData={formattedCategories}
        />
      </BusProvider>
      <ApiList entityName="categories" entityIdName="categoryId" />
    </>
  );
};

export default CategoriesPage;
