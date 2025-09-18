"use client";

import { Heading } from "@colonydb/anthill/Heading";
import { Inline } from "@colonydb/anthill/Inline";
import { Section } from "@colonydb/anthill/Section";
import { Specimen } from "@colonydb/anthill/Specimen";
import { Stack } from "@colonydb/anthill/Stack";
import { TabBlock } from "@colonydb/anthill/TabBlock";
import { useForm } from "@colonydb/anthill/useForm";
import * as v from "valibot";
import { sourceConfigSchema } from "@/schemas/sourceConfigSchema";
import SourceHtmlSamples from "./SourceHtmlSamples";
import SourceItems from "./SourceItems";
import SourceOverview from "./SourceOverview";
import SourceStats from "./SourceStats";

export const SourcePreview = () => {
  const { data } = useForm(sourceConfigSchema);
  return (
    <Section title={<Heading>Preview</Heading>}>
      <TabBlock
        items={[
          {
            key: "overview",
            label: "Overview",
            content: v.is(sourceConfigSchema, data) ? (
              <Stack>
                <Specimen>
                  <SourceOverview config={data} debug />
                </Specimen>
                <SourceStats config={data} />
              </Stack>
            ) : (
              <Inline font="regular-italic" hue="gray">
                Not configured
              </Inline>
            ),
          },
          {
            key: "items",
            label: "Items",
            content: v.is(sourceConfigSchema, data) ? (
              <Specimen>
                <SourceItems sources={[data]} debug />
              </Specimen>
            ) : (
              <Inline font="regular-italic" hue="gray">
                Not configured
              </Inline>
            ),
          },
          {
            key: "matched",
            label: "Sample HTML",
            content: v.is(sourceConfigSchema, data) ? (
              <SourceHtmlSamples config={data} sampleSet="matched" />
            ) : (
              <Inline font="regular-italic" hue="gray">
                Not configured
              </Inline>
            ),
          },
        ]}
        seamless
      />
    </Section>
  );
};
