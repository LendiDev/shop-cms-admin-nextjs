"use client";

import { PlusSquareIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useListener } from "react-bus";
import { Size } from "@prisma/client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import AlertModal from "@/components/modals/alert-modal";
import { DIALOG_ANIMATION_MS } from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";
import { SizeColumn, columns } from "./table/columns";

interface SizesClientProps {
  sizes: Size[];
  tableData: SizeColumn[];
}

const SizesClient: React.FC<SizesClientProps> = ({
  sizes = [],
  tableData = [],
}) => {
  const sizesCount = sizes.length > 0 ? `(${sizes.length})` : "";

  const [alertOpen, setAlertOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sizeToDelete, setCategoryToDelete] = useState<SizeColumn>();

  const router = useRouter();
  const params = useParams();

  const onAddNew = () => {
    router.push(`/${params.storeId}/sizes/new`, { scroll: false });
  };

  const onEdit = (sizeId: string) => {
    router.push(`/${params.storeId}/sizes/${sizeId}`, {
      scroll: false,
    });
  };

  const onRemove = (size: SizeColumn) => {
    setAlertOpen(true);
    setCategoryToDelete(size);
  };

  const onRemoveHandler = async () => {
    if (!sizeToDelete?.id) {
      toast.error("Something went wrong...");
      setAlertOpen(false);
    }

    try {
      setLoading(true);

      await axios.delete(`/api/${params.storeId}/sizes/${sizeToDelete?.id}`);

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

  useListener("openSizeDeleteAlert", (size: SizeColumn | undefined) => {
    onRemove(size as SizeColumn);
  });

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
            title={`Sizes ${sizesCount}`}
            subtitle="Manage your store sizes"
          />
          <Button size="sm" onClick={onAddNew}>
            <PlusSquareIcon className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>
        <Separator />
        <DataTable columns={columns} data={tableData} searchBy="name" />
      </div>
    </>
  );
};

export default SizesClient;
