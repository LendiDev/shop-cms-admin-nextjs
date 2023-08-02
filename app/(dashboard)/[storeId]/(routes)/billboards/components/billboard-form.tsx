"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
  imageUrl: z.string().url({
    message: "Image is required",
  }),
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

  const params = useParams();
  const router = useRouter();

  const onSubmit = async (data: BillboardFormValues) => {
    try {
      console.log("on submit pressed", data);
      await axios.post(`/api/stores/${params.storeId}/billboards`, data);
      router.refresh();
      toast.success("New billboard created.");
    } catch (error) {
      console.log("error posting new billboard", error);
      toast.error(`Billboard wasn't created.`);
    }
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
                <FormLabel>Background Image</FormLabel>
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
              Create
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default BillboardForm;
