import { Billboard, Category, Size } from "@prisma/client";
import axios from "axios";

const storeApi = axios.create({ baseURL: "/api" });

interface BillboardsResponse {
  billboards: Billboard[];
}

interface CategoryResponse {
  category: Category;
}

export const fetchSize = async (storeId: string, sizeId: string) => {
  const response = await storeApi.get<{
    size: Size;
  }>(`/${storeId}/sizes/${sizeId}`);
  const { size } = response.data;

  return size;
};

export const fetchCategory = async (storeId: string, categoryId: string) => {
  const response = await storeApi.get<CategoryResponse>(
    `/${storeId}/categories/${categoryId}`
  );
  const { category } = response.data;

  return category;
};

export const fetchBillboards = async (storeId: string) => {
  const response = await storeApi.get<BillboardsResponse>(
    `/${storeId}/billboards`
  );
  const { billboards } = response.data;

  return billboards;
};
