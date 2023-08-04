"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ImageUploader from "@/components/ui/image-uploader";
import { Billboard } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { DIALOG_ANIMATION_MS } from "@/components/ui/dialog";

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().url({
    message: "Image is required",
  }),
  labelColor: z.string().optional(),
});

interface BillboardFormProps {
  isNew: boolean;
  onCloseModal: () => void;
}

type BillboardFormValues = z.infer<typeof formSchema>;

const BillboardForm: React.FC<BillboardFormProps> = ({
  isNew,
  onCloseModal,
}) => {
  const actionButtonText = isNew ? "Create" : "Update";
  const action = isNew ? "created" : "updated";

  const [initialLoading, setInitialLoading] = useState(!isNew);
  const [loading, setLoading] = useState(false);

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: "",
      imageUrl: "",
      labelColor: "#000",
    },
  });

  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!isNew) {
      setInitialLoading(true);

      axios
        .get(`/api/${params.storeId}/billboards/${params.billboardId}`)
        .then(({ data }: { data: { billboard: Billboard } }) => {
          const { billboard } = data;

          form.setValue("label", billboard.label);
          form.setValue("labelColor", billboard.labelColor || "#000");
          form.setValue("imageUrl", billboard.imageUrl);

          setInitialLoading(false);
        })
        .catch(() => {
          toast.error("Billboard not found");
          onCloseModal();
        });
    }
  }, [form, isNew, onCloseModal, params.billboardId, params.storeId]);

  const onSubmit = async (data: BillboardFormValues) => {
    try {
      setLoading(true);

      if (isNew) {
        await axios.post(`/api/${params.storeId}/billboards`, data);
      } else {
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          data
        );
      }

      router.refresh();
      onCloseModal();
      toast.success(`Billboard ${action}.`);
    } catch (error) {
      toast.error(`Billboard wasn't ${action}`);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, DIALOG_ANIMATION_MS);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-2"
        >
          {initialLoading ? (
            <Skeleton className="w-full h-[404px]" />
          ) : (
            <>
              <FormField
                name="imageUrl"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Background Image</FormLabel>
                    <FormControl>
                      <ImageUploader
                        value={field.value ? [field.value] : []}
                        onChange={(url) => field.onChange(url)}
                        onRemove={() => field.onChange("")}
                        labelPreview={form.watch("label")}
                        labelPreviewColor={form.watch("labelColor")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="label"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billboard Label</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="Enter billboard label..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="labelColor"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label colour</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="Label color"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <div className="flex justify-evenly space-x-2 sm:justify-end pt-3 [&>*]:flex-1 [&>*]:sm:flex-none">
            <Button
              onClick={onCloseModal}
              variant="outline"
              type="button"
              size="sm"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              type="submit"
              disabled={initialLoading || loading}
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                actionButtonText
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default BillboardForm;
