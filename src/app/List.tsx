"use client";

import { useEffect, useState } from "react";
import useSWR from "swr/immutable";
import type { ListConfig, ListResult } from ".";

type Props = Omit<ListConfig, "id">;

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const List = ({
  exclude,
  include,
  itemSelector,
  linkSelector,
  name,
  titleSelector,
  url,
}: Props) => {
  const [requestUrl, setRequestUrl] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (window) {
      const result = new URL("/api", window.location.href);

      if (exclude) result.searchParams.set("exclude", exclude);
      if (include) result.searchParams.set("include", include);
      result.searchParams.set("itemSelector", itemSelector);
      if (linkSelector) result.searchParams.set("linkSelector", linkSelector);
      if (titleSelector) result.searchParams.set("titleSelector", titleSelector);
      result.searchParams.set("url", url);

      timeoutId = setTimeout(() => {
        setRequestUrl(result.href);
      }, 500);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [exclude, include, itemSelector, titleSelector, url, linkSelector]);

  const { data, error, isLoading, isValidating } = useSWR<ListResult>(requestUrl, fetcher);

  return (
    <>
      <h4>
        <a href={url}>{name}</a>
      </h4>
      {isValidating ? (
        <p>Validating…</p>
      ) : isLoading ? (
        <p>Loading…</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : data === undefined || data.items.length === 0 ? (
        <div>
          <p>No results</p>
          <pre>{JSON.stringify(data?.debug, null, 2)}</pre>
        </div>
      ) : (
        <ul>
          {data.items.map(({ title, url }, index) => {
            const key = `${title}:${url}:${index}`;
            return <li key={key}>{url ? <a href={url}>{title}</a> : title}</li>;
          })}
        </ul>
      )}
    </>
  );
};

export default List;
