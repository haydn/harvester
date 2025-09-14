"use client";

import type { FormAction } from "@colonydb/anthill";
import { Block } from "@colonydb/anthill/Block";
import { Button } from "@colonydb/anthill/Button";
import { Card } from "@colonydb/anthill/Card";
import { CardContent } from "@colonydb/anthill/CardContent";
import { DialogHeader } from "@colonydb/anthill/DialogHeader";
import { Form } from "@colonydb/anthill/Form";
import { FormFooter } from "@colonydb/anthill/FormFooter";
import { Heading } from "@colonydb/anthill/Heading";
import { Inline } from "@colonydb/anthill/Inline";
import { RegularField } from "@colonydb/anthill/RegularField";
import { Section } from "@colonydb/anthill/Section";
import { Specimen } from "@colonydb/anthill/Specimen";
import { Stack } from "@colonydb/anthill/Stack";
import { StringInput } from "@colonydb/anthill/StringInput";
import { TabBlock } from "@colonydb/anthill/TabBlock";
import { useForm } from "@colonydb/anthill/useForm";
import { useCallback } from "react";
import * as v from "valibot";
import type { SourceConfig } from "@/index";
import { sourceConfigSchema } from "@/schemas/sourceConfigSchema";
import SourceHtmlSamples from "./SourceHtmlSamples";
import SourceItems from "./SourceItems";
import SourceOverview from "./SourceOverview";
import SourceStats from "./SourceStats";

type Props = {
  id: string;
  initialData: SourceConfig;
  onCancel: () => void;
  onSubmit: (list: SourceConfig) => void;
  onSuccess: () => void;
  title: string;
};

export const SourceForm = ({ id, initialData, onCancel, onSubmit, onSuccess, title }: Props) => {
  const action = useCallback<FormAction<typeof sourceConfigSchema>>(
    async ({ data }) => {
      onSubmit(data);
      return {
        data,
        ok: true,
      };
    },
    [onSubmit],
  );
  return (
    <Form
      action={action}
      onSuccess={onSuccess}
      id={id}
      initialData={initialData}
      schema={sourceConfigSchema}
    >
      <Card
        header={
          <DialogHeader close={onCancel}>
            <Heading>{title}</Heading>
          </DialogHeader>
        }
        footer={
          <FormFooter
            actionLabel="Save"
            secondaryAction={<Button onClick={onCancel}>Cancel</Button>}
          />
        }
      >
        <CardContent>
          <div
            style={{
              gap: "calc(var(--context-spacing) * 2)",
              display: "grid",
              columnRule: "var(--context-border)",
              gridTemplateColumns:
                "calc(var(--width-small) - var(--context-spacing) * 2) calc(var(--width-medium) - var(--context-spacing) * 2)",
            }}
          >
            <Configuration />
            <Preview />
          </div>
        </CardContent>
      </Card>
    </Form>
  );
};

const Configuration = () => (
  <Section title={<Heading>Configuration</Heading>}>
    <Stack>
      <RegularField label="Name" name="name" required>
        <StringInput name="name" placeholder="Reddit" />
      </RegularField>
      <RegularField label="Page URL" name="url" required>
        <StringInput name="url" placeholder="https://www.reddit.com/" />
      </RegularField>
      <TabBlock
        items={[
          {
            key: "items",
            label: "Items",
            content: (
              <Stack>
                <RegularField
                  description={
                    <Block font="tiny">
                      CSS selector identifying the items on the page to be listed.
                    </Block>
                  }
                  label="Item Selector"
                  name="itemSelector"
                  required
                >
                  <StringInput name="itemSelector" placeholder="article" />
                </RegularField>
                <RegularField
                  description={
                    <Block font="tiny">
                      CSS selector applied to each item to identify its title. If not provided, the
                      text of the entire item will be used.
                    </Block>
                  }
                  label="Title Selector"
                  name="titleSelector"
                >
                  <StringInput name="titleSelector" placeholder="h1, h2, h3, h4, h5, h6" />
                </RegularField>
                <RegularField
                  description={
                    <Block font="tiny">
                      CSS selector applied to each item to identify its link. If not provided, the
                      items itself will be used.
                    </Block>
                  }
                  label="Link Selector"
                  name="linkSelector"
                >
                  <StringInput name="linkSelector" placeholder="a" />
                </RegularField>
              </Stack>
            ),
          },
          {
            key: "filters",
            label: "Filters",
            content: (
              <Stack>
                <RegularField
                  description={
                    <Block font="tiny">
                      A comma-separated list of phrases to filter the items by. If an item does not
                      contain any of the phrases, it will be excluded from the list.
                    </Block>
                  }
                  label="Include"
                  name="include"
                >
                  <StringInput name="include" placeholder="example, example two" />
                </RegularField>
                <RegularField
                  description={
                    <Block font="tiny">
                      A comma-separated list of phrases to filter the items by. If an item contains
                      any of the phrases, it will be excluded from the list.
                    </Block>
                  }
                  label="Exclude"
                  name="exclude"
                >
                  <StringInput name="exclude" placeholder="example, example two" />
                </RegularField>
              </Stack>
            ),
          },
        ]}
        seamless
      />
    </Stack>
  </Section>
);

const Preview = () => {
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
