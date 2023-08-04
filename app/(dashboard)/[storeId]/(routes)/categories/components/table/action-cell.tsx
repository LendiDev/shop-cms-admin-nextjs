"use client";

import { EditIcon, MoreVerticalIcon, Trash2Icon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useBus } from "react-bus";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CategoryColumn } from "./columns";

interface CategoryActionCellProps {
  data: CategoryColumn;
}

const CategoryActionCell: React.FC<CategoryActionCellProps> = ({ data }) => {
  const bus = useBus();
  const params = useParams();
  const router = useRouter();

  const onUpdateHandler = () => {
    router.push(`/${params.storeId}/categories/${data.id}`);
  };

  const onDeleteClicked = () => {
    bus.emit("openCategoryDeleteAlert", data);
  };

  return (
    <DropdownMenu>
      <div className="flex justify-center items-center">
        <DropdownMenuTrigger>
          <MoreVerticalIcon className="h-5 w5" />
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={onUpdateHandler}>
          <EditIcon className="w-4 h-4 mr-2 " /> Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onDeleteClicked}
          className="text-destructive"
        >
          <Trash2Icon className="w-4 h-4 mr-2" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CategoryActionCell;
