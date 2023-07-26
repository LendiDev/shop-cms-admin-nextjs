"use client";

import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Trash2 } from "lucide-react";
import { Store } from "@prisma/client";
import axios from "axios";
import toast from "react-hot-toast";

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
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import AlertModal from "@/components/modals/alert-modal";

const formSchema = z.object({
  name: z.string().min(1),
});

interface SettingsFormProps {
  initialData: Store;
}

type SettingsFormValues = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const router = useRouter();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (values: SettingsFormValues) => {
    if (initialData.name === values.name) {
      return;
    }

    try {
      setIsLoading(true);

      await axios.patch(`/api/stores/${initialData.id}`, {
        name: values.name,
      });

      toast.success("Store has been successfully updated.");
      router.refresh();
    } catch (error) {
      toast.error("Store is not updated");
    } finally {
      setIsLoading(false);
    }
  };

  const onDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/stores/${initialData.id}`);

      toast.success("Store has been successfully deleted.");

      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error("Store is not deleted");
    } finally {
      setOpenAlert(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={openAlert}
        isLoading={isLoading}
        setOpen={setOpenAlert}
        onConfirmAction={onDeleteConfirm}
        actionButtonText="Delete store"
        description={`The store "${initialData.name}" will be deleted permanently. This action cannot be undone.`}
      />
      <div className="flex justify-between items-center">
        <Heading title="Settings" subtitle="Manage store preferences" />
        <Button
          variant="destructive"
          size="icon"
          className="w-8 h-8"
          disabled={isLoading}
          onClick={() => setOpenAlert(true)}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
      <Separator />
      <div className="grid grid-cols-3 gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Enter store name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isLoading} className="mt-4" type="submit">
              {!isLoading ? (
                "Save changes"
              ) : (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};
