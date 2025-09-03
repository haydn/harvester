import * as v from "valibot";
import type { SourceConfig } from "..";

export const addSource = async (key: string, { arg: source }: { arg: SourceConfig }) => {
  const current = JSON.parse(localStorage.getItem(key) ?? "[]");

  v.parse(
    v.object({
      exclude: v.optional(v.string()),
      id: v.string(),
      include: v.optional(v.string()),
      itemSelector: v.pipe(v.string(), v.nonEmpty()),
      linkSelector: v.optional(v.string()),
      name: v.pipe(v.string(), v.nonEmpty()),
      titleSelector: v.optional(v.string()),
      url: v.pipe(v.string(), v.nonEmpty(), v.url()),
    }),
    source,
  );

  const value = current ? [...current, source] : [source];

  localStorage.setItem(key, JSON.stringify(value));

  return value;
};
