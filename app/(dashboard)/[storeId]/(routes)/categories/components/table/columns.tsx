import { ColumnDef } from "@tanstack/react-table";

export type CategoryColumns = {
  name: string;
  billboard: string;
  createdAt: string;
};

export const columns: ColumnDef<CategoryColumns>[] = [
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
];
