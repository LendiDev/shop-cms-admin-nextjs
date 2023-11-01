"use client";

import { useEffect, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Billboard, Category } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DIALOG_ANIMATION_MS } from "@/components/ui/dialog";
import { fetchBillboards, fetchCategory } from "@/lib/api";

interface CategoryParams extends Params {
  storeId: string;
  categoryId: string;
}

const formSchema = z.object({
  name: z.string().min(1),
  billboardId: z.string().optional(),
});

interface CategoryFormProps {
  isNew: boolean;
  onCloseModal: () => void;
}

type CategoryFormValues = z.infer<typeof formSchema>;

const CategoryForm: React.FC<CategoryFormProps> = ({ isNew, onCloseModal }) => {
  const actionButtonText = isNew ? "Create" : "Update";
  const action = isNew ? "created" : "updated";

  const [initialLoading, setInitialLoading] = useState(!isNew);
  const [loading, setLoading] = useState(false);
  const [billboards, setBillboards] = useState<Billboard[]>([]);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      billboardId: undefined,
    },
  });

  const params = useParams() as CategoryParams;
  const router = useRouter();

  useEffect(() => {
    let isSubscribed = true;
    setInitialLoading(true);

    if (!isNew) {
      const fetchData = async () => {
        return Promise.all([
          await fetchCategory(params.storeId, params.categoryId),
          await fetchBillboards(params.storeId),
        ]);
      };

      fetchData()
        .then(([category, billboards]) => {
          if (isSubscribed) {
            setBillboards(billboards);
            form.setValue("name", category.name);
            form.setValue("billboardId", category.billboardId);
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
      fetchBillboards(params.storeId)
        .then((billboards) => {
          if (isSubscribed) {
            setBillboards(billboards);
          }
        })
        .catch(() => {
          toast.error("Something went wrong");
          onCloseModal();
        })
        .finally(() => {
          setInitialLoading(false);
        });
    }

    return () => {
      isSubscribed = false;
    };
  }, [form, isNew, onCloseModal, params.categoryId, params.storeId]);

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setLoading(true);

      if (isNew) {
        await axios.post(`/api/${params.storeId}/categories`, data);
      } else {
        await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          data
        );
      }

      router.refresh();
      onCloseModal();
      toast.success(`Category ${action}.`);
    } catch (error) {
      toast.error(`Category wasn't ${action}`);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, DIALOG_ANIMATION_MS);
    }
  };

  const onNewBillboard = () => {
    router.push(`/${params.storeId}/billboards/new`, { scroll: false });
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-2"
        >
          {initialLoading ? (
            <Skeleton className={`w-full h-[168px]`} />
          ) : (
            <>
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input
                        autoFocus={true}
                        autoComplete="off"
                        placeholder="Category..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="billboardId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billboard</FormLabel>
                    <FormDescription className="text-xs m-0">
                      optional
                    </FormDescription>
                    <Select
                      required={false}
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select billboard" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {billboards.length === 0 && (
                          <div className="flex justify-center items-center gap-2">
                            <p className="p-2 text-center">No billboards yet</p>
                            <Button onClick={onNewBillboard} size="sm">
                              Create new
                            </Button>
                          </div>
                        )}
                        {billboards.map(({ id, label }) => {
                          return (
                            <SelectItem key={id} value={id}>
                              {label}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
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

export default CategoryForm;
