"use client";

import { Badge } from "@colonydb/anthill/Badge";
import { CodeBlock } from "@colonydb/anthill/CodeBlock";
import { Icon } from "@colonydb/anthill/Icon";
import { Inline } from "@colonydb/anthill/Inline";
import { Stack } from "@colonydb/anthill/Stack";
import { useSource } from "@/hooks/useSource";
import type { SourceConfig } from "@/index";

type Props = {
  config: SourceConfig;
  sampleSet: "excludeFilter" | "includeFilter" | "matched";
};

const SourceHtmlSamples = ({ config, sampleSet }: Props) => {
  const { data, error, isLoading } = useSource(config, true);

  return isLoading ? (
    <Icon symbol="Processing" />
  ) : error ? (
    <Badge hue="red">
      <Icon symbol="Warning" />
    </Badge>
  ) : data?.debug?.htmlSamples[sampleSet].length !== undefined &&
    data.debug.htmlSamples[sampleSet].length > 0 ? (
    <Stack>
      {data.debug.htmlSamples[sampleSet].map((sample, index) => (
        <CodeBlock key={`${index}:${sample.slice(0, 20)}`} language="html">
          {sample}
        </CodeBlock>
      ))}
    </Stack>
  ) : (
    <Inline font="regular-italic" muted>
      None
    </Inline>
  );
};

export default SourceHtmlSamples;
