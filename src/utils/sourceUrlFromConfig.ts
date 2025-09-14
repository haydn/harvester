import type { SourceConfig } from "..";

export const sourceUrlFromConfig = (
  { exclude, include, itemSelector, linkSelector, titleSelector, url }: SourceConfig,
  location: Location | null,
  debug?: boolean,
) => {
  if (!location) return undefined;

  const result = new URL("/source", location.href);

  if (exclude) result.searchParams.set("exclude", exclude);
  if (include) result.searchParams.set("include", include);

  result.searchParams.set("itemSelector", itemSelector);

  if (linkSelector) result.searchParams.set("linkSelector", linkSelector);
  if (titleSelector) result.searchParams.set("titleSelector", titleSelector);

  result.searchParams.set("url", url);

  if (debug) result.searchParams.set("debug", "true");

  return result.href;
};
