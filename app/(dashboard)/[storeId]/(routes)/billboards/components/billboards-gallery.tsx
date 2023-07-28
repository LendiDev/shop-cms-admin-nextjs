"use client";

import { PlusSquareIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Billboard } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

interface BillboardsGalleryProps {
  billboards: Billboard[];
}

const BillboardsGallery: React.FC<BillboardsGalleryProps> = ({
  billboards = [],
}) => {
  const router = useRouter();
  const params = useParams();

  const onAddNew = () => {
    router.push(`/${params.storeId}/billboards/new`);
  };

  return (
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
        <div>Show them</div>
      )}
    </div>
  );
};

export default BillboardsGallery;
