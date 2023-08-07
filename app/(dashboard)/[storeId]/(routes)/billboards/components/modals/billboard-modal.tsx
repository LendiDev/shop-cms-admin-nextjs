"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams, usePathname, useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BillboardForm from "../billboard-form";

interface BillboardModalProps {}

const BillboardModal: React.FC<BillboardModalProps> = () => {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  const isNew = pathname.includes("/billboards/new");

  const modalTitle = isNew ? "Create new billboard" : "Edit billboard";
  const modalDescription = isNew
    ? "Add a new billboard"
    : "Update your billboard";

  useEffect(() => {
    if (pathname.includes("/billboards/")) {
      setIsOpen(true);
    }
  }, [pathname]);

  const onClose = useCallback(() => {
    setIsOpen(false);
    router.replace(`/${params.storeId}/billboards`, { scroll: false });
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

export default dynamic(() => Promise.resolve(BillboardModal), { ssr: false });
