"use client";

import { PlusSquareIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useListener } from "react-bus";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Category } from "@prisma/client";
import AlertModal from "@/components/modals/alert-modal";
import { DIALOG_ANIMATION_MS } from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";
import { CategoryColumn, columns } from "./table/columns";

interface CategoriesClientProps {
  categories: Category[];
  tableData: CategoryColumn[];
}

const CategoriesClient: React.FC<CategoriesClientProps> = ({
  categories = [],
  tableData = [],
}) => {
  const categoriesCount = categories.length > 0 ? `(${categories.length})` : "";

  const [alertOpen, setAlertOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryColumn>();

  const router = useRouter();
  const params = useParams();

  const onAddNew = () => {
    router.push(`/${params.storeId}/categories/new`, { scroll: false });
  };

  const onEdit = (categoryId: string) => {
    router.push(`/${params.storeId}/categories/${categoryId}`, {
      scroll: false,
    });
  };

  const onRemove = (category: CategoryColumn) => {
    setAlertOpen(true);
    setCategoryToDelete(category);
  };

  const onRemoveHandler = async () => {
    if (!categoryToDelete?.id) {
      toast.error("Something went wrong...");
      setAlertOpen(false);
    }

    try {
      setLoading(true);

      await axios.delete(
        `/api/${params.storeId}/categories/${categoryToDelete?.id}`
      );

      toast.success("Category has been successfully deleted.");
      router.refresh();
      setAlertOpen(false);
    } catch (error) {
      toast.error("Category is not deleted");
      setLoading(false);
    } finally {
      setAlertOpen(false);
      setTimeout(() => {
        setLoading(false);
      }, DIALOG_ANIMATION_MS + 100);
    }
  };

  useListener(
    "openCategoryDeleteAlert",
    (category: CategoryColumn | undefined) => {
      onRemove(category as CategoryColumn);
    }
  );

  return (
    <>
      <AlertModal
        isOpen={alertOpen}
        setOpen={setAlertOpen}
        isLoading={loading}
        onConfirmAction={onRemoveHandler}
        actionButtonText="Delete"
      />
      <div className="space-y-3">
        <div className="flex flex-row items-center justify-between">
          <Heading
            title={`Categories ${categoriesCount}`}
            subtitle="Manage your categories"
          />
          <Button size="sm" onClick={onAddNew}>
            <PlusSquareIcon className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>
        <Separator />
        <DataTable columns={columns} data={tableData} />
      </div>
    </>
  );
};

export default CategoriesClient;
