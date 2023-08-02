"use client";

import { useMounted } from "@/hooks/use-mounted";
import { useCallback, useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BillboardForm from "../billboard-form";
import { useParams, usePathname, useRouter } from "next/navigation";

interface BillboardModalProps {}

const BillboardModal: React.FC<BillboardModalProps> = () => {
  const { isMounted } = useMounted();
  const [isOpen, setIsOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  const modalTitle = isNew ? "Create new billboard" : "Edit billboard";
  const modalDescription = isNew
    ? "Add a new billboard"
    : "Update your billboard";

  useEffect(() => {
    if (pathname.includes("/billboards/new")) {
      setIsOpen(true);
      setIsNew(true);
    }
    if (pathname.includes(`/billboards/${params.billboardId}`)) {
      setIsOpen(true);
    }
  }, [params.billboardId, pathname]);

  const onClose = useCallback(() => {
    setIsOpen(false);
    router.replace(`/${params.storeId}/billboards`, { scroll: false });
  }, [params.storeId, router]);

  if (!isMounted) {
    return false;
  }

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

export default BillboardModal;
