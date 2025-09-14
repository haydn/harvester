import type { SourceResponse } from "..";

export const sourceFetcher = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
  }

  const result = (await response.json()) as SourceResponse;

  if (result.ok === false) {
    throw Error(`Failed to fetch data: ${result.errors.join(", ")}`);
  }

  return result;
};
