import * as v from "valibot";

export const sourceRequestSchema = v.object({
  debug: v.pipe(
    v.optional(v.string(), "false"),
    v.toLowerCase(),
    v.union([v.literal("true"), v.literal("false"), v.literal("t"), v.literal("f")]),
    v.transform((value) => value === "true" || value === "t"),
  ),
  exclude: v.pipe(
    v.optional(v.string(), ""),
    v.toLowerCase(),
    v.transform((value) =>
      value
        .split(",")
        .map((phrase) => phrase.trim())
        .filter((phrase) => phrase !== ""),
    ),
  ),
  include: v.pipe(
    v.optional(v.string(), ""),
    v.toLowerCase(),
    v.transform((value) =>
      value
        .split(",")
        .map((phrase) => phrase.trim())
        .filter((phrase) => phrase !== ""),
    ),
  ),
  itemSelector: v.string(),
  linkSelector: v.optional(v.string()),
  titleSelector: v.optional(v.string()),
  url: v.pipe(v.string(), v.url()),
});
