"use client";

import { useMounted } from "@/hooks/use-mounted";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Billboard } from "@prisma/client";
import BillboardForm from "../billboard-form";

interface BillboardModalProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  isLoading?: boolean | undefined;
  billboard?: Billboard;
}

const BillboardModal: React.FC<BillboardModalProps> = ({
  isOpen,
  setOpen,
  isLoading = false,
}) => {
  const { isMounted } = useMounted();

  const onClose = () => {
    setOpen(false);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new billboard</DialogTitle>
          <DialogDescription>Add a new billboard</DialogDescription>
        </DialogHeader>
        <BillboardForm isLoading={isLoading} onCloseModal={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default BillboardModal;
