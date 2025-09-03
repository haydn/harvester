import useSWR, { type Fetcher, type Key, type SWRConfiguration } from "swr";
import type { BlockingData, IsLoadingResponse } from "swr/_internal";

/**
 * A rudimentary implementation of the proposed useSWRList. Limited to 20 keys.
 *
 * @see https://github.com/vercel/swr/discussions/1988
 */
// biome-ignore lint/suspicious/noExplicitAny: matches the type signature of useSWR
export const useSWRList = <Data = any, Error = any>(
  keys: Key[],
  fetcher: Fetcher<Data> | null,
  config?: SWRConfiguration<Data, Error>,
): {
  data: Array<
    BlockingData<Data, SWRConfiguration<Data, Error>> extends true ? Data : Data | undefined
  >;
  error: Error | undefined;
  isValidating: boolean;
  isLoading: IsLoadingResponse<Data, SWRConfiguration<Data, Error>>;
} => {
  const result00 = useSWR(keys.at(0), fetcher, config);
  const result01 = useSWR(keys.at(1), fetcher, config);
  const result02 = useSWR(keys.at(2), fetcher, config);
  const result03 = useSWR(keys.at(3), fetcher, config);
  const result04 = useSWR(keys.at(4), fetcher, config);
  const result05 = useSWR(keys.at(5), fetcher, config);
  const result06 = useSWR(keys.at(6), fetcher, config);
  const result07 = useSWR(keys.at(7), fetcher, config);
  const result08 = useSWR(keys.at(8), fetcher, config);
  const result09 = useSWR(keys.at(9), fetcher, config);
  const result10 = useSWR(keys.at(10), fetcher, config);
  const result11 = useSWR(keys.at(11), fetcher, config);
  const result12 = useSWR(keys.at(12), fetcher, config);
  const result13 = useSWR(keys.at(13), fetcher, config);
  const result14 = useSWR(keys.at(14), fetcher, config);
  const result15 = useSWR(keys.at(15), fetcher, config);
  const result16 = useSWR(keys.at(16), fetcher, config);
  const result17 = useSWR(keys.at(17), fetcher, config);
  const result18 = useSWR(keys.at(18), fetcher, config);
  const result19 = useSWR(keys.at(19), fetcher, config);

  const results = [
    result00,
    result01,
    result02,
    result03,
    result04,
    result05,
    result06,
    result07,
    result08,
    result09,
    result10,
    result11,
    result12,
    result13,
    result14,
    result15,
    result16,
    result17,
    result18,
    result19,
  ];

  return {
    data: results.map((result) => result.data),
    error: results.find((result) => result.error)?.error,
    isLoading: results.every((result) => result.isLoading),
    isValidating: results.some((result) => result.isValidating),
  };
};
