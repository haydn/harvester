import * as v from "valibot";
import { listSchema } from "@/schemas/listSchema";
import type { SourceConfig } from "..";

export const removeSource = async (key: string, { arg: source }: { arg: SourceConfig }) => {
  const current = JSON.parse(localStorage.getItem(key) ?? "[]");

  v.assert(listSchema, current);

  const value = current ? [...current.filter((x) => x.id !== source.id)] : [];

  localStorage.setItem(key, JSON.stringify(value));

  return value;
};
