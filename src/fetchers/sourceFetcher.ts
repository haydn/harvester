import type { SourceResult } from "@/index";

export const sourceFetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
  }
  const result = await response.json();
  return result as SourceResult;
};
