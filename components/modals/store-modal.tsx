"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { useStoreModal } from "@/hooks/use-store-modal";
import Modal from "@/components/ui/modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Store } from "@prisma/client";
import { Loader2 } from "lucide-react";

const TOAST_ANIMATION_MS = 2000;

const formSchema = z.object({
  name: z.string().min(1, "Store name must be at least 1 character"),
});

export const StoreModal = () => {
  const modalStore = useStoreModal();

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      const response = await axios.post<Store>("/api/stores", values);

      // force close modal new store dialog
      onReset();
      modalStore.onForceClose();
      // show success toast
      toast.success(`Store ${response.data.name} has been created.`, {
        duration: TOAST_ANIMATION_MS,
      });
      // go to newly created store, preventing to go back.
      router.replace(`/${response.data.id}`);
    } catch (error) {
      // TODO: custom errors based on error
      toast.error("Something went wrong...");
      setIsLoading(false);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, TOAST_ANIMATION_MS);
    }
  };

  const onCancel = () => {
    onReset();
    modalStore.onClose();
  };

  const onReset = () => {
    form.reset();
    form.clearErrors();
  };

  return (
    <Modal
      title="Create Store"
      description="Add a new store"
      isOpen={modalStore.isOpen}
      onClose={modalStore.onClose}
    >
      <div className="py-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Store name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="shop"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <div className="flex justify-end items-center pt-4 space-x-2">
              <Button
                disabled={isLoading}
                variant="outline"
                onClick={onCancel}
                type="button"
                size="sm"
              >
                Cancel
              </Button>
              <Button
                disabled={isLoading}
                type="submit"
                className="w-20"
                size="sm"
              >
                {!isLoading ? (
                  "Create"
                ) : (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
