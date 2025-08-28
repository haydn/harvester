"use client";

import { CodeBlock } from "@colonydb/anthill/CodeBlock";
import { Header } from "@colonydb/anthill/Header";
import { Heading } from "@colonydb/anthill/Heading";
import { Link } from "@colonydb/anthill/Link";
import { PlainText } from "@colonydb/anthill/PlainText";
import { RichText } from "@colonydb/anthill/RichText";
import { Section } from "@colonydb/anthill/Section";
import { Stack } from "@colonydb/anthill/Stack";
import { type ReactNode, useEffect, useState } from "react";
import useSWR from "swr/immutable";
import { Temporal } from "temporal-polyfill";
import type { ListConfig, ListResult } from ".";

type Props = {
  actions?: ReactNode;
  debug?: boolean;
} & Omit<ListConfig, "id">;

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) {
      throw Error(`Failed to fetch data: ${r.status} ${r.statusText}`);
    }
    return r.json();
  });

const List = ({
  actions,
  debug = false,
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

  const { data, error, isLoading, isValidating } = useSWR<ListResult, Error>(requestUrl, fetcher);

  return (
    <Section
      headingLevel={2}
      spacing="00"
      title={
        <Header
          actions={actions}
          description={
            data ? (
              <PlainText font="small" color={["gray-s1", "gray-t1"]}>
                Updated:{" "}
                {Temporal.Instant.from(data?.fetchedAt).toLocaleString(undefined, {
                  timeStyle: "long",
                  dateStyle: "medium",
                })}
              </PlainText>
            ) : null
          }
        >
          <Heading>
            <Link href={url}>{name}</Link>
          </Heading>
        </Header>
      }
    >
      {isValidating ? (
        <p>Validating…</p>
      ) : isLoading ? (
        <p>Loading…</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : data === undefined || data.items.length === 0 ? (
        <Stack>
          <PlainText color={["gray-s1", "gray-t1"]} font="regular-italic">
            No results
          </PlainText>
          {debug && data?.debug ? (
            <CodeBlock language="json">{JSON.stringify(data.debug, null, 2)}</CodeBlock>
          ) : null}
        </Stack>
      ) : (
        <RichText>
          <ul>
            {data.items.map(({ title, url }, index) => {
              const key = `${title}:${url}:${index}`;
              return <li key={key}>{url ? <a href={url}>{title}</a> : title}</li>;
            })}
          </ul>
        </RichText>
      )}
    </Section>
  );
};

export default List;
