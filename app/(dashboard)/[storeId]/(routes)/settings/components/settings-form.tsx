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
import { DIALOG_ANIMATION_MS } from "@/components/ui/dialog";
import ApiEndPoints from "./api-endpoints";

const formSchema = z.object({
  name: z.string().min(1),
});

interface SettingsFormProps {
  initialData: Store;
}

type SettingsFormValues = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const onDeleteConfirm = async () => {
    try {
      setIsLoading(true);
      setIsDeleting(true);

      await axios.delete(`/api/stores/${initialData.id}`);

      toast.success("Store has been successfully deleted.");

      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error("Store is not deleted");
      setIsLoading(false);
      setIsDeleting(false);
    } finally {
      setOpenAlert(false);
      setTimeout(() => {
        setIsLoading(false);
        setIsDeleting(false);
      }, DIALOG_ANIMATION_MS + 100);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={openAlert}
        isLoading={isLoading}
        setOpen={setOpenAlert}
        onConfirmAction={onDeleteConfirm}
        actionButtonText="Confirm"
        description={`The store "${initialData.name}" will be deleted permanently. This action cannot be undone.`}
      />
      <div className="flex justify-between items-center">
        <Heading title="Settings" subtitle="Manage store preferences" />
        <Button
          variant="destructive"
          size="sm"
          disabled={isLoading}
          onClick={() => setOpenAlert(true)}
        >
          <Trash2 className="mr-2 h-5 w-5" />
          Delete Store
        </Button>
      </div>
      <Separator />
      <div className="grid gap-6 pb-2 sm:grid-cols-3">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col"
          >
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
            <Button
              disabled={isLoading}
              className="mt-4 self-center w-full xs:w-fit xs:self-start"
              type="submit"
            >
              {!isLoading || isDeleting ? (
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
      <Separator />
      <ApiEndPoints />
    </>
  );
};
