"use client";

import { Badge } from "@colonydb/anthill/Badge";
import { Block } from "@colonydb/anthill/Block";
import { Icon } from "@colonydb/anthill/Icon";
import { Inline } from "@colonydb/anthill/Inline";
import { Temporal } from "temporal-polyfill";
import { useSource } from "@/hooks/useSource";
import type { SourceConfig } from "@/index";

type Props = {
  config: SourceConfig;
};

const SourceStats = ({ config }: Props) => {
  const { data, error, isLoading } = useSource(config, true);

  return isLoading ? (
    <Icon symbol="Processing" />
  ) : error ? (
    <Inline>
      <Badge hue="red">
        <Icon symbol="Warning" />
      </Badge>{" "}
      {error.message}
    </Inline>
  ) : data?.debug !== undefined ? (
    <>
      <Block>
        Source fetched:{" "}
        {Temporal.Instant.from(data.fetchedAt).toLocaleString(undefined, {
          dateStyle: "short",
          timeStyle: "long",
        })}
      </Block>
      <Block>Items matched: {data.debug.itemsMatched}</Block>
      <Block>Items omitted by "Include" filter: {data.debug.itemsRemovedByIncludeFilter}</Block>
      <Block>Items omitted by "Exclude" filter: {data.debug.itemsRemovedByExcludeFilter}</Block>
    </>
  ) : (
    <Inline font="regular-italic" muted>
      None
    </Inline>
  );
};

export default SourceStats;
