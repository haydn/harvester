"use client";

import { Badge } from "@colonydb/anthill/Badge";
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
  sources: Array<SourceConfig>;
};

const List = ({ sources }: Props) => {
  const location = useLocation();

  const sourceUrls = useMemo(
    () => sources.map((source) => sourceUrlFromConfig(source, location)),
    [location, sources],
  );

  const { data, isLoading } = useSWRList(sourceUrls, sourceFetcher);

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
  ) : data.length === 0 ? (
    <Inline font="regular-italic" hue="gray">
      No results
    </Inline>
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

export default List;
