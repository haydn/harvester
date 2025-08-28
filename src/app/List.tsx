"use client";

import { Badge } from "@colonydb/anthill/Badge";
import { CodeBlock } from "@colonydb/anthill/CodeBlock";
import { Header } from "@colonydb/anthill/Header";
import { Heading } from "@colonydb/anthill/Heading";
import { Inline } from "@colonydb/anthill/Inline";
import { Link } from "@colonydb/anthill/Link";
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
              <Inline font="tiny" hue="gray">
                {Temporal.Instant.from(data?.fetchedAt).toLocaleString(undefined, {
                  dateStyle: "short",
                  timeStyle: "long",
                })}
              </Inline>
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
          <Inline font="regular-italic" hue="gray">
            No results
          </Inline>
          {debug && data?.debug ? (
            <CodeBlock language="json">{JSON.stringify(data.debug, null, 2)}</CodeBlock>
          ) : null}
        </Stack>
      ) : (
        <Stack tagName="ul">
          {data.items.map(({ firstSeen, title, url: itemUrl }, index) => {
            const key = `${title}:${itemUrl}:${index}`;
            return (
              <li key={key} style={{ breakInside: "avoid" }}>
                <div>
                  {Temporal.Now.instant()
                    .since(Temporal.Instant.from(firstSeen))
                    .round({ roundingMode: "trunc", smallestUnit: "days" }).days < 2 ? (
                    <>
                      <Badge hue="lime">New</Badge>{" "}
                    </>
                  ) : null}
                  {itemUrl ? <Link href={itemUrl}>{title}</Link> : title}
                </div>
                <div>
                  <Inline font="tiny" hue="gray">
                    <Link href={url}>{name}</Link>
                    {" • "}
                    {Temporal.Instant.from(firstSeen).toLocaleString(undefined, {
                      dateStyle: "short",
                      timeStyle: "long",
                    })}
                  </Inline>
                </div>
              </li>
            );
          })}
        </Stack>
      )}
    </Section>
  );
};

export default List;
