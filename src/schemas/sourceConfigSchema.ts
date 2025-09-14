import * as v from "valibot";

export const sourceConfigSchema = v.object({
  exclude: v.optional(v.string()),
  id: v.string(),
  include: v.optional(v.string()),
  itemSelector: v.pipe(v.string(), v.nonEmpty()),
  linkSelector: v.optional(v.string()),
  name: v.pipe(v.string(), v.nonEmpty()),
  titleSelector: v.optional(v.string()),
  url: v.pipe(v.string(), v.nonEmpty(), v.url()),
});
