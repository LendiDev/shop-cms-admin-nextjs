import { ColumnDef } from "@tanstack/react-table";
import CategoryActionCell from "./action-cell";

export type CategoryColumn = {
  id: string;
  name: string;
  billboard: string;
  createdAt: string;
};

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Category Name",
  },
  {
    accessorKey: "billboard",
    header: "Billboard",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    id: "actions",
    cell: ({ row }) => <CategoryActionCell data={row.original} />,
  },
];
