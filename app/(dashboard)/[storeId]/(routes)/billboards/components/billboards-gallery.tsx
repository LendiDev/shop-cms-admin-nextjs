"use client";

import { EditIcon, PlusSquareIcon, Trash2 } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Billboard } from "@prisma/client";
import BillboardModal from "./modals/billboard-modal";
import Image from "next/image";

interface BillboardsGalleryProps {
  billboards: Billboard[];
}

const BillboardsGallery: React.FC<BillboardsGalleryProps> = ({
  billboards = [],
}) => {
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

  return (
    <>
      <BillboardModal />
      <div className="space-y-3">
        <div className="flex flex-row items-center justify-between">
          <Heading title="Billboards" subtitle="Manage your billboards" />
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
                    layout="fill"
                    objectFit="cover"
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
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex absolute bottom-0 left-0 bg-white py-1 px-2 bg-opacity-90 w-full">
                    <p className="text-ellipsis line-clamp-1">
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
