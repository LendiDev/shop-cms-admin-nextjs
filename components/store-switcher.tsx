"use client";

import React, { useState } from "react";
import { Store } from "@prisma/client";
import {
  Check,
  ChevronsUpDownIcon,
  PlusSquare,
  Store as StoreIcon,
} from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useStoreModal } from "@/hooks/use-store-modal";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[];
}

export function StoreSwitcher({ className, items = [] }: StoreSwitcherProps) {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const { onOpen } = useStoreModal();

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentStore = formattedItems.find(
    (item) => item.value === params.storeId
  );

  const getRestPathName = () => {
    const pathNameArray = pathname.split("/");
    return pathNameArray.slice(2).join("/");
  };

  const onSelectStore = (store: { value: string; label: string }) => {
    setOpen(false);
    router.push(`/${store.value}/${getRestPathName()}`);
  };

  const onCreateStore = () => {
    setOpen(false);
    onOpen();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="mr-3">
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a store"
          aria-controls={undefined}
          className={cn("w-[200px] flex justify-between")}
        >
          <StoreIcon className="mr-2 w-4 h-4" />
          <p className="flex-1 text-left line-clamp-1 text-ellipsis">
            {currentStore?.label || "Select store..."}
          </p>
          <ChevronsUpDownIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search store..." />
          <CommandEmpty className="flex justify-center py-3 text-sm">
            No stores found.
          </CommandEmpty>
          <CommandList>
            <CommandGroup>
              {formattedItems.map((store) => {
                const isSelectable = currentStore?.value !== store.value;

                return (
                  <CommandItem
                    key={store.value}
                    onSelect={() => {
                      onSelectStore(store);
                    }}
                    disabled={!isSelectable}
                    className={cn(isSelectable && "cursor-pointer")}
                  >
                    <StoreIcon className="mr-2 w-4 h-4" />
                    <p className="flex-1 line-clamp-1 text-ellipsis">
                      {store.label}
                    </p>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        isSelectable ? "opacity-0" : "opacity-100"
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                aria-expanded={open}
                aria-label="Create a store"
                onSelect={onCreateStore}
                className="cursor-pointer py-2 font-medium"
              >
                <PlusSquare className="mr-2 w-4 h-4" />
                Create Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
