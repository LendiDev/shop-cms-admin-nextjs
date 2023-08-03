import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import ApiList from "@/components/ui/api-list";
import BillboardModal from "./components/modals/category-modal";
import CategoriesTable from "./components/categories-table";
import { CategoryColumns } from "./components/table/columns";

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

  const formattedCategories: CategoryColumns[] = categories.map(
    ({ name, createdAt, billboard: { label } }) => {
      return {
        name,
        billboard: label,
        createdAt: format(createdAt, "dd/MM/yy h:mmbbb"),
      };
    }
  );

  return (
    <>
      <BillboardModal />
      <CategoriesTable
        categories={categories}
        tableData={formattedCategories}
      />
      <ApiList entityName="categories" entityIdName="categoryId" />
    </>
  );
};

export default CategoriesPage;
