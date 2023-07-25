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
import prismadb from "@/lib/prismadb";

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

      const response = await axios.post<typeof prismadb.store.fields>(
        "/api/stores",
        values
      );

      // force close modal new store dialog
      modalStore.onForceClose();
      // show success toast
      toast.success(`Store ${response.data.name} has been created.`, {
        duration: 2000,
      });
      // go to newly created store, preventing to go back.
      router.replace(`/${response.data.id}`);
    } catch (error) {
      toast.error("Something went wrong...");
    } finally {
      setIsLoading(false);
    }
  };

  const onCancel = () => {
    form.reset();
    form.clearErrors();
    modalStore.onClose();
  };

  return (
    <Modal
      title="Create Store"
      description="Add a new store"
      isOpen={modalStore.isOpen}
      onClose={modalStore.onClose}
    >
      <div className="pb-4 space-y-4 py-2">
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
            <div className="flex justify-end items-center pt-4 space-x-1">
              <Button
                disabled={isLoading}
                variant="outline"
                onClick={onCancel}
                type="button"
              >
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit">
                Create
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
