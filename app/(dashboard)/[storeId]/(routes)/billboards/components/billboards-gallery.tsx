"use client";

import { EditIcon, PlusSquareIcon, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Billboard } from "@prisma/client";
import BillboardModal from "./modals/billboard-modal";
import Image from "next/image";
import AlertModal from "@/components/modals/alert-modal";

import { DIALOG_ANIMATION_MS } from "@/components/ui/dialog";

interface BillboardsGalleryProps {
  billboards: Billboard[];
}

const BillboardsGallery: React.FC<BillboardsGalleryProps> = ({
  billboards = [],
}) => {
  const billboardsCount = billboards.length > 0 ? `(${billboards.length})` : "";

  const [alertOpen, setAlertOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [billboardToDelete, setBillboardToDelete] = useState<Billboard>();

  const router = useRouter();
  const params = useParams();

  const onAddNew = () => {
    router.push(`/${params.storeId}/billboards/new`, { scroll: false });
  };

  const onEdit = (billboardId: string) => {
    router.push(`/${params.storeId}/billboards/${billboardId}`, {
      scroll: false,
    });
  };

  const onRemove = (billboard: Billboard) => {
    setAlertOpen(true);
    setBillboardToDelete(billboard);
  };

  const onRemoveHandler = async () => {
    if (!billboardToDelete?.id) {
      toast.error("Something went wrong...");
      setAlertOpen(false);
    }

    try {
      setLoading(true);

      await axios.delete(
        `/api/stores/${params.storeId}/billboards/${billboardToDelete?.id}`
      );

      toast.success("Billboard has been successfully deleted.");
      router.refresh();
      setAlertOpen(false);
    } catch (error) {
      toast.error("Billboard is not deleted");
      setLoading(false);
    } finally {
      setAlertOpen(false);
      setTimeout(() => {
        setLoading(false);
      }, DIALOG_ANIMATION_MS + 100);
    }
  };

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
            title={`Billboards ${billboardsCount}`}
            subtitle="Manage your billboards"
          />
          <Button size="sm" onClick={onAddNew}>
            <PlusSquareIcon className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>
        <Separator />
        {billboards.length === 0 ? (
          <div className="flex flex-col items-center pt-5 gap-3">
            No billboards found
            <Button size="sm" variant="outline" onClick={onAddNew}>
              <PlusSquareIcon className="mr-2 h-4 w-4" />
              Add New
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-3 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-2">
            {billboards.map((billboard) => {
              return (
                <div
                  key={billboard.id}
                  className="group/container block relative w-full h-40 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden"
                >
                  <Image
                    priority={true}
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    src={billboard.imageUrl}
                    alt={"Billboard image preview"}
                    quality={25}
                  />
                  <div className="flex gap-2 absolute top-2 right-2 group-hover/container:visible sm:invisible">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8"
                      onClick={() => onEdit(billboard.id)}
                    >
                      <EditIcon className="mr-2 w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="w-8 h-8"
                      onClick={() => onRemove(billboard)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex justify-center items-center absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full px-10">
                    <p
                      className="text-center select-none"
                      style={{ color: billboard.labelColor || "#000" }}
                    >
                      {billboard.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default BillboardsGallery;
