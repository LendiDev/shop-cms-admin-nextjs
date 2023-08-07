"use client";

import { Copy, EditIcon, MoreVerticalIcon, Trash2Icon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useBus } from "react-bus";
import copy from "copy-to-clipboard";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SizeColumn } from "./columns";
import toast from "react-hot-toast";

interface SizeActionCellProps {
  data: SizeColumn;
}

const SizeActionCell: React.FC<SizeActionCellProps> = ({ data }) => {
  const bus = useBus();
  const params = useParams();
  const router = useRouter();

  const onUpdateHandler = () => {
    router.push(`/${params.storeId}/sizes/${data.id}`);
  };

  const onDeleteClicked = () => {
    bus.emit("openSizeDeleteAlert", data);
  };

  const onCopyToClipboard = () => {
    copy(data.id);
    toast.success("Size ID copied to the clipboard");
  };

  return (
    <DropdownMenu>
      <div className="flex justify-center items-center">
        <DropdownMenuTrigger>
          <MoreVerticalIcon className="h-5 w5" />
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={onCopyToClipboard}>
          <Copy className="w-4 h-4 mr-2 " /> Copy ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
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

export default SizeActionCell;
