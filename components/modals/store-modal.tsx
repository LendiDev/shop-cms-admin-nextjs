"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Store } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

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
import { DIALOG_ANIMATION_MS } from "@/components/ui/dialog";

const formSchema = z.object({
  name: z.string().min(1, "Store name must be at least 1 character"),
});

export const StoreModal = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { signOut } = useClerk();
  const modalStore = useStoreModal();
  const pathname = usePathname();
  const router = useRouter();

  const isRoot = pathname === "/";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      const response = await axios.post<Store>("/api", values);

      if (isRoot) {
        window.location.assign(`/${response.data.id}`);
      } else {
        modalStore.onClose();
        toast.success(`Store "${response.data.name}" created successfully`);
        router.replace(`/${response.data.id}`);
        router.refresh();
      }
    } catch (error) {
      // TODO: custom errors based on error
      toast.error("Something went wrong...");
      setIsLoading(false);
      resetFormWithDelay();
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, DIALOG_ANIMATION_MS);
    }
  };

  const onCancel = () => {
    modalStore.onClose();
    resetFormWithDelay();
  };

  const onReset = () => {
    form.reset();
    form.clearErrors();
  };

  const onSignOut = () => {
    signOut().then(() => {
      window.location.assign("/");
    });
  };

  const resetFormWithDelay = () => {
    setTimeout(() => {
      form.reset();
    }, DIALOG_ANIMATION_MS);
    form.clearErrors();
  };

  return (
    <Modal
      title="Create Store"
      description="Add a new store"
      isOpen={modalStore.isOpen}
      onClose={isRoot ? () => {} : modalStore.onClose}
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
                        autoComplete="off"
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
            <div className="flex justify-between items-center pt-4 space-x-2">
              {isRoot && (
                <Button
                  disabled={isLoading}
                  variant="secondary"
                  className="self-start mr-auto"
                  onClick={onSignOut}
                  type="button"
                  size="sm"
                >
                  Log out
                </Button>
              )}

              <Button
                disabled={isLoading}
                variant="outline"
                className="ml-auto"
                onClick={isRoot ? onReset : onCancel}
                type="button"
                size="sm"
              >
                {isRoot ? "Reset" : "Cancel"}
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
