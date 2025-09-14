import { useMemo } from "react";
import useSWR from "swr";
import { sourceFetcher } from "@/fetchers/sourceFetcher";
import { sourceUrlFromConfig } from "@/utils/sourceUrlFromConfig";
import type { SourceConfig } from "..";
import { useLocation } from "./useLocation";

export const useSource = (config: SourceConfig, debug: boolean = false) => {
  const location = useLocation();

  const sourceUrl = useMemo(
    () => sourceUrlFromConfig(config, location, debug),
    [config, debug, location],
  );

  return useSWR<Awaited<ReturnType<typeof sourceFetcher>>, Error>(sourceUrl, sourceFetcher, {
    shouldRetryOnError: false,
  });
};
