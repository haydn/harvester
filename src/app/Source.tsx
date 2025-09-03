"use client";

import { Badge } from "@colonydb/anthill/Badge";
import { Header } from "@colonydb/anthill/Header";
import { Icon } from "@colonydb/anthill/Icon";
import { Inline } from "@colonydb/anthill/Inline";
import { Link } from "@colonydb/anthill/Link";
import { type ReactNode, useMemo } from "react";
import useSWR from "swr/immutable";
import { Temporal } from "temporal-polyfill";
import { sourceFetcher } from "@/fetchers/sourceFetcher";
import { useLocation } from "@/hooks/useLocation";
import type { SourceConfig, SourceResult } from "@/index";
import { sourceUrlFromConfig } from "@/utils/sourceUrlFromConfig";

type Props = {
  actions?: ReactNode;
  config: SourceConfig;
};

const Source = ({ actions, config }: Props) => {
  const location = useLocation();

  const sourceUrl = useMemo(() => sourceUrlFromConfig(config, location), [config, location]);

  const { data, error, isLoading } = useSWR<SourceResult, Error>(sourceUrl, sourceFetcher);

  return (
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
      {data?.items.some(
        ({ firstSeen }) =>
          Temporal.Now.instant()
            .since(Temporal.Instant.from(firstSeen))
            .round({ roundingMode: "trunc", smallestUnit: "hours" }).hours <
          (process.env.NODE_ENV === "development" ? 1 : 36),
      ) ? (
        <>
          <Badge hue="lime">New</Badge>{" "}
        </>
      ) : null}
      <Link href={config.url}>{config.name}</Link>{" "}
      <Inline hue="gray">
        {isLoading ? <Icon symbol="Processing" /> : `(${data?.items.length ?? 0})`}
      </Inline>
      {error ? (
        <>
          {" "}
          <Badge hue="red">
            <Icon symbol="Warning" />
          </Badge>
        </>
      ) : null}
    </Header>
  );
};

export default Source;
