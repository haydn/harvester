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
  fetcher: Fetcher<Data> | null = null,
  config?: SWRConfiguration<Data, Error>,
): {
  data: Array<
    BlockingData<Data, SWRConfiguration<Data, Error>> extends true ? Data : Data | undefined
  >;
  error: AggregateError | undefined;
  isValidating: boolean;
  isLoading: IsLoadingResponse<Data, SWRConfiguration<Data, Error>>;
} => {
  if (keys.length > 20) throw new TypeError("useSWRList only supports up to 20 keys");

  const result00 = useSWR(keys[0], fetcher, config);
  const result01 = useSWR(keys[1], fetcher, config);
  const result02 = useSWR(keys[2], fetcher, config);
  const result03 = useSWR(keys[3], fetcher, config);
  const result04 = useSWR(keys[4], fetcher, config);
  const result05 = useSWR(keys[5], fetcher, config);
  const result06 = useSWR(keys[6], fetcher, config);
  const result07 = useSWR(keys[7], fetcher, config);
  const result08 = useSWR(keys[8], fetcher, config);
  const result09 = useSWR(keys[9], fetcher, config);
  const result10 = useSWR(keys[10], fetcher, config);
  const result11 = useSWR(keys[11], fetcher, config);
  const result12 = useSWR(keys[12], fetcher, config);
  const result13 = useSWR(keys[13], fetcher, config);
  const result14 = useSWR(keys[14], fetcher, config);
  const result15 = useSWR(keys[15], fetcher, config);
  const result16 = useSWR(keys[16], fetcher, config);
  const result17 = useSWR(keys[17], fetcher, config);
  const result18 = useSWR(keys[18], fetcher, config);
  const result19 = useSWR(keys[19], fetcher, config);

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

  const errors = results.map((result) => result.error).filter((error) => error !== undefined);

  return {
    data: results.map((result) => result.data),
    error: errors.length > 0 ? new AggregateError(errors) : undefined,
    isLoading: results.every((result) => result.isLoading),
    isValidating: results.some((result) => result.isValidating),
  };
};
