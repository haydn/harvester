import * as v from "valibot";
import { listSchema } from "@/schemas/listSchema";

export const listFetcher = (key: string) => {
  const value = localStorage.getItem(key);
  const list = value === null ? [] : JSON.parse(value);
  v.assert(listSchema, list);
  return list;
};
