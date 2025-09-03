import type { SourceConfig } from "..";

export const sourceUrlFromConfig = (
  { exclude, include, itemSelector, linkSelector, titleSelector, url }: SourceConfig,
  location: Location | null,
) => {
  if (!location) return undefined;

  const result = new URL("/api", location.href);

  if (exclude) result.searchParams.set("exclude", exclude);
  if (include) result.searchParams.set("include", include);

  result.searchParams.set("itemSelector", itemSelector);

  if (linkSelector) result.searchParams.set("linkSelector", linkSelector);
  if (titleSelector) result.searchParams.set("titleSelector", titleSelector);

  result.searchParams.set("url", url);

  return result.href;
};
