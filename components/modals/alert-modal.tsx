"use client";

import { useMounted } from "@/hooks/use-mounted";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button, ButtonProps } from "@/components/ui/button";

interface AlertModalProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  onConfirmAction: () => void;
  isLoading?: boolean | undefined;
  title?: string | undefined;
  description?: string | undefined;
  actionButtonText?: string | undefined;
  actionButtonVariant?: ButtonProps["variant"];
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  setOpen,
  onConfirmAction,
  isLoading,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone.",
  actionButtonText = "Confirm",
  actionButtonVariant = "destructive",
}) => {
  const { isMounted } = useMounted();

  if (!isMounted) {
    return null;
  }

  const onOpenChange = (open: boolean) => {
    setOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center space-x-2 sm:justify-end">
          <Button
            disabled={isLoading}
            onClick={() => onOpenChange(false)}
            variant="outline"
            size="sm"
          >
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            onClick={onConfirmAction}
            variant={actionButtonVariant}
            size="sm"
          >
            {actionButtonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AlertModal;
