"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import Modal from "@/components/ui/modal";

export const StoreModal = () => {
  const modalStore = useStoreModal();

  return (
    <Modal
      title="Create Store"
      description="Add a new store"
      isOpen={modalStore.isOpen}
      onClose={modalStore.onClose}
    >
      Future Store Form
    </Modal>
  );
};
