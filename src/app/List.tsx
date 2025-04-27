"use client";

import { useEffect, useState } from "react";
import useSWR from "swr/immutable";
import type { ListConfig, ListResult } from ".";

type Props = Omit<ListConfig, "id">;

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const List = ({ name, url, itemSelector, itemFilter, titleSelector, linkSelector }: Props) => {
  const [requestUrl, setRequestUrl] = useState<string | null>(null);

  useEffect(() => {
    if (window) {
      const result = new URL("/api", window.location.href);

      if (itemFilter) result.searchParams.set("itemFilter", itemFilter);
      result.searchParams.set("itemSelector", itemSelector);
      if (titleSelector) result.searchParams.set("titleSelector", titleSelector);
      result.searchParams.set("url", url);
      if (linkSelector) result.searchParams.set("linkSelector", linkSelector);

      setRequestUrl(result.href);
    }
  }, [itemFilter, itemSelector, titleSelector, url, linkSelector]);

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
          {data.items.map(({ title, url }) => (
            <li key={url}>
              <a href={url}>{title}</a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default List;
