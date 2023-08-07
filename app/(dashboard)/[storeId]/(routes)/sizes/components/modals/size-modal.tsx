"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SizeForm from "../size-form";

interface BillboardModalProps {}

const CategoryModal: React.FC<BillboardModalProps> = () => {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  const isNew = pathname.includes("/sizes/new");
  const modalTitle = isNew ? "Create new size" : "Edit a size";
  const modalDescription = isNew
    ? "Add a new size to your store"
    : "Update a size";

  useEffect(() => {
    if (pathname.includes("/sizes/")) {
      setIsOpen(true);
    }
  }, [pathname]);

  const onClose = useCallback(() => {
    setIsOpen(false);
    router.replace(`/${params.storeId}/sizes`, { scroll: false });
  }, [params.storeId, router]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
          <DialogDescription>{modalDescription}</DialogDescription>
        </DialogHeader>
        <SizeForm isNew={isNew} onCloseModal={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default dynamic(() => Promise.resolve(CategoryModal), { ssr: false });
