import { Billboard } from "@prisma/client";
import axios from "axios";

const storeApi = axios.create({ baseURL: "/api" });

interface Billboards {
  billboards: Billboard[];
}

export const fetchBillboards = async (storeId: string) => {
  const response = await storeApi.get<Billboards>(`/${storeId}/billboards`);
  const { billboards } = response.data;

  return billboards;
};
