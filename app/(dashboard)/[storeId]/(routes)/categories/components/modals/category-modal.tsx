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
import BillboardForm from "../category-form";

interface BillboardModalProps {}

const CategoryModal: React.FC<BillboardModalProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  const modalTitle = isNew ? "Create new category" : "Edit a category";
  const modalDescription = isNew
    ? "Add a new category to your store"
    : "Update a category";

  useEffect(() => {
    if (pathname.includes("/categories/new")) {
      setIsOpen(true);
      setIsNew(true);
    }
    if (pathname.includes(`/categories/${params.categoryId}`)) {
      setIsOpen(true);
    }
  }, [params.categoryId, pathname]);

  const onClose = useCallback(() => {
    setIsOpen(false);
    router.replace(`/${params.storeId}/categories`, { scroll: false });
  }, [params.storeId, router]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
          <DialogDescription>{modalDescription}</DialogDescription>
        </DialogHeader>
        <BillboardForm isNew={isNew} onCloseModal={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default dynamic(() => Promise.resolve(CategoryModal), { ssr: false });
