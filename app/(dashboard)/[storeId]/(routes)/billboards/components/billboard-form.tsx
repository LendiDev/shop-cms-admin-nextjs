"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CldUploadButton, CldUploadWidget } from "next-cloudinary";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Billboard } from "@prisma/client";
import { Button } from "@/components/ui/button";
import ImageUploader from "@/components/ui/image-uploader";

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string(),
});

interface BillboardFormProps {
  initialData?: Billboard;
  isLoading: boolean;
  onCloseModal: () => void;
}

type BillboardFormValues = z.infer<typeof formSchema>;

const BillboardForm: React.FC<BillboardFormProps> = ({
  initialData,
  isLoading,
  onCloseModal,
}) => {
  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (values: BillboardFormValues) => {
    console.log("on submit pressed", values);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-2"
        >
          <FormField
            name="imageUrl"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image Url</FormLabel>
                <FormControl>
                  <ImageUploader
                    value={field.value ? [field.value] : []}
                    disabled={isLoading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
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
                    disabled={isLoading}
                    placeholder="Enter billboard label..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-evenly space-x-2 sm:justify-end pt-3 [&>*]:flex-1 [&>*]:sm:flex-none">
            <Button
              disabled={isLoading}
              onClick={onCloseModal}
              variant="outline"
              type="button"
              size="sm"
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              variant="default"
              size="sm"
              type="submit"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default BillboardForm;
