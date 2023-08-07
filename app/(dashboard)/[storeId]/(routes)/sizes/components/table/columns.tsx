import { ColumnDef } from "@tanstack/react-table";
import SizeActionCell from "./action-cell";

export type SizeColumn = {
  id: string;
  name: string;
  value: number;
  createdAt: string;
};

export const columns: ColumnDef<SizeColumn>[] = [
  {
    accessorKey: "name",
    header: "Size Name",
  },
  {
    accessorKey: "value",
    header: "Value",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    id: "actions",
    cell: ({ row }) => <SizeActionCell data={row.original} />,
  },
];
