import * as v from "valibot";
import type { SourceConfig } from "..";

export const editSource = async (key: string, { arg: source }: { arg: SourceConfig }) => {
  const current = JSON.parse(localStorage.getItem(key) ?? "[]") as Array<SourceConfig>;

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

  const value = current ? [...current.filter((x) => x.id !== source.id), source] : [source];

  localStorage.setItem("lists", JSON.stringify(value));

  return value;
};
