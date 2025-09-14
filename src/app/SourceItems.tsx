"use client";

import { Badge } from "@colonydb/anthill/Badge";
import { Icon } from "@colonydb/anthill/Icon";
import { Inline } from "@colonydb/anthill/Inline";
import { Link } from "@colonydb/anthill/Link";
import { Stack } from "@colonydb/anthill/Stack";
import { useMemo } from "react";
import { Temporal } from "temporal-polyfill";
import { sourceFetcher } from "@/fetchers/sourceFetcher";
import { useLocation } from "@/hooks/useLocation";
import { useSWRList } from "@/hooks/useSWRList";
import { sourceUrlFromConfig } from "@/utils/sourceUrlFromConfig";
import type { SourceConfig } from "..";

type Props = {
  debug?: boolean;
  sources: Array<SourceConfig>;
};

const SourceItems = ({ debug = false, sources }: Props) => {
  const location = useLocation();

  const sourceUrls = useMemo(
    () => sources.map((source) => sourceUrlFromConfig(source, location, debug)),
    [debug, location, sources],
  );

  const { data, error, isLoading } = useSWRList(sourceUrls, sourceFetcher, {
    shouldRetryOnError: false,
  });

  const items = data
    .flatMap((result, resultIndex) =>
      (result?.items ?? []).map((item, itemIndex) => ({
        ...item,
        key: `${item.title}:${item.url}:${resultIndex}:${itemIndex}`,
        source: {
          name: sources[resultIndex]?.name ?? "Unknown",
          url: sources[resultIndex]?.url ?? "",
        },
      })),
    )
    .sort(
      (a, b) =>
        Temporal.Instant.compare(
          Temporal.Instant.from(b.firstSeen),
          Temporal.Instant.from(a.firstSeen),
        ) || a.title.localeCompare(b.title),
    );

  return isLoading ? (
    <p>Loading…</p>
  ) : items.length === 0 ? (
    error ? (
      <Inline>
        <Badge hue="red">
          <Icon symbol="Warning" />
        </Badge>{" "}
        {error.errors?.join(", ") ?? error.message}
      </Inline>
    ) : (
      <Inline font="regular-italic" hue="gray">
        No results
      </Inline>
    )
  ) : (
    <Stack tagName="ul">
      {items.map(({ key, source, ...item }) => (
        <li key={key} style={{ breakInside: "avoid" }}>
          <div>
            {Temporal.Now.instant()
              .since(Temporal.Instant.from(item.firstSeen))
              .round({ roundingMode: "trunc", smallestUnit: "hours" }).hours <
            (process.env.NODE_ENV === "development" ? 1 : 36) ? (
              <>
                <Badge hue="lime">New</Badge>{" "}
              </>
            ) : null}
            {item.url ? <Link href={item.url}>{item.title}</Link> : item.title}
          </div>
          <div>
            <Inline font="tiny" hue="gray">
              <Link href={source.url}>{source.name}</Link>
              {" • "}
              {Temporal.Instant.from(item.firstSeen).toLocaleString(undefined, {
                dateStyle: "short",
                timeStyle: "long",
              })}
            </Inline>
          </div>
        </li>
      ))}
    </Stack>
  );
};

export default SourceItems;
