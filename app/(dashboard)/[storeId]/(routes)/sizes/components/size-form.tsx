"use client";

import { useEffect, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

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
import { Skeleton } from "@/components/ui/skeleton";
import { DIALOG_ANIMATION_MS } from "@/components/ui/dialog";
import { fetchSize } from "@/lib/api";

interface SizesParams extends Params {
  storeId: string;
  sizeId: string;
}

const formSchema = z.object({
  name: z.string().min(1),
  value: z.coerce.number().min(0.1),
});

interface SizesFormProps {
  isNew: boolean;
  onCloseModal: () => void;
}

type SizesFormValues = z.infer<typeof formSchema>;

const SizesForm: React.FC<SizesFormProps> = ({ isNew, onCloseModal }) => {
  const actionButtonText = isNew ? "Create" : "Update";
  const action = isNew ? "created" : "updated";

  const [initialLoading, setInitialLoading] = useState(!isNew);
  const [loading, setLoading] = useState(false);

  const form = useForm<SizesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      value: 0,
    },
  });

  const params = useParams() as SizesParams;
  const router = useRouter();

  useEffect(() => {
    let isSubscribed = true;

    if (!isNew) {
      setInitialLoading(true);

      const fetchData = async () => {
        return await fetchSize(params.storeId, params.sizeId);
      };

      fetchData()
        .then((size) => {
          if (isSubscribed) {
            form.setValue("name", size.name);
            form.setValue("value", size.value);
          }
        })
        .catch(() => {
          toast.error("Something went wrong");
          onCloseModal();
        })
        .finally(() => {
          setInitialLoading(false);
        });
    } else {
    }

    return () => {
      isSubscribed = false;
    };
  }, [form, isNew, onCloseModal, params.sizeId, params.storeId]);

  const onSubmit = async (data: SizesFormValues) => {
    try {
      setLoading(true);

      if (isNew) {
        await axios.post(`/api/${params.storeId}/sizes`, data);
      } else {
        await axios.patch(
          `/api/${params.storeId}/sizes/${params.sizeId}`,
          data
        );
      }

      router.refresh();
      onCloseModal();
      toast.success(`Size ${action}.`);
    } catch (error) {
      toast.error(`Size wasn't ${action}`);
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
            <Skeleton className={`w-full h-[152px]`} />
          ) : (
            <>
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sizes Name</FormLabel>
                    <FormControl>
                      <Input
                        autoFocus={true}
                        autoComplete="off"
                        placeholder="Size name..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="value"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step={0.1}
                        autoComplete="off"
                        placeholder="Enter value"
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

export default SizesForm;
