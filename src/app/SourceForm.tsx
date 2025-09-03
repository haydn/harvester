"use client";

import { Action } from "@colonydb/anthill/Action";
import { Block } from "@colonydb/anthill/Block";
import { Button } from "@colonydb/anthill/Button";
import { Card } from "@colonydb/anthill/Card";
import { CardContent } from "@colonydb/anthill/CardContent";
import { Form } from "@colonydb/anthill/Form";
import { FormFooter } from "@colonydb/anthill/FormFooter";
import { Header } from "@colonydb/anthill/Header";
import { Heading } from "@colonydb/anthill/Heading";
import { Icon } from "@colonydb/anthill/Icon";
import { Inline } from "@colonydb/anthill/Inline";
import { MultiColumnStack } from "@colonydb/anthill/MultiColumnStack";
import { RegularField } from "@colonydb/anthill/RegularField";
import { Section } from "@colonydb/anthill/Section";
import { Specimen } from "@colonydb/anthill/Specimen";
import { Stack } from "@colonydb/anthill/Stack";
import { StringInput } from "@colonydb/anthill/StringInput";
import { TabSet } from "@colonydb/anthill/TabSet";
import { useForm } from "@colonydb/anthill/useForm";
import { useState } from "react";
import * as v from "valibot";
import type { SourceConfig } from "@/index";
import { sourceSchema } from "@/schemas/sourceSchema";
import List from "./List";
import Source from "./Source";

type Props = {
  id: string;
  initialData: SourceConfig;
  onCancel: () => void;
  onSubmit: (list: SourceConfig) => void;
  onSuccess: () => void;
  title: string;
};

export const SourceForm = ({ id, initialData, onCancel, onSubmit, onSuccess, title }: Props) => {
  const [tab, setTab] = useState<"items" | "filters">("items");
  return (
    <Form
      action={async ({ data }) => {
        onSubmit(data);
        return {
          data,
          ok: true,
        };
      }}
      onSuccess={onSuccess}
      id={id}
      initialData={initialData}
      schema={sourceSchema}
    >
      <Card
        header={
          <Header
            actions={
              <Action
                fontSize="heading"
                icon={<Icon symbol="Remove" />}
                title="close"
                onClick={() => {
                  onCancel();
                }}
              />
            }
          >
            <Heading>{title}</Heading>
          </Header>
        }
        footer={
          <FormFooter
            actionLabel="Save"
            secondaryAction={
              <Button
                onClick={() => {
                  onCancel();
                }}
              >
                Cancel
              </Button>
            }
          />
        }
      >
        <CardContent>
          <div
            style={{
              gap: "2rlh",
              display: "grid",
              columnRule: "1px solid currentColor",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            }}
          >
            <Section title={<Heading>Configuration</Heading>}>
              <RegularField label="Name" name="name" required>
                <StringInput name="name" placeholder="Reddit" />
              </RegularField>
              <RegularField label="Page URL" name="url" required>
                <StringInput name="url" placeholder="https://www.reddit.com/" />
              </RegularField>
              <TabSet
                items={[
                  {
                    key: "items",
                    label: "Items",
                    onClick: () => {
                      setTab("items");
                    },
                    selected: tab === "items",
                  },
                  {
                    key: "filters",
                    label: "Filters",
                    onClick: () => {
                      setTab("filters");
                    },
                    selected: tab === "filters",
                  },
                ]}
              />
              {tab === "items" ? (
                <>
                  <RegularField label="Item Selector" name="itemSelector" required>
                    <Block font="tiny">
                      CSS selector identifying the items on the page to be listed.
                    </Block>
                    <StringInput name="itemSelector" placeholder="article" />
                  </RegularField>
                  <RegularField label="Title Selector" name="titleSelector">
                    <Block font="tiny">
                      CSS selector applied to each item to identify its title. If not provided, the
                      text of the entire item will be used.
                    </Block>
                    <StringInput name="titleSelector" placeholder="h1, h2, h3, h4, h5, h6" />
                  </RegularField>
                  <RegularField label="Link Selector" name="linkSelector">
                    <Block font="tiny">
                      CSS selector applied to each item to identify its link. If not provided, the
                      items itself will be used.
                    </Block>
                    <StringInput name="linkSelector" placeholder="a" />
                  </RegularField>
                </>
              ) : null}
              {tab === "filters" ? (
                <>
                  <RegularField label="Include" name="include">
                    <Block font="tiny">
                      A comma-separated list of phrases to filter the items by. If an item does not
                      contain any of the phrases, it will be excluded from the list.
                    </Block>
                    <StringInput name="include" placeholder="example, example two" />
                  </RegularField>
                  <RegularField label="Exclude" name="exclude">
                    <Block font="tiny">
                      A comma-separated list of phrases to filter the items by. If an item contains
                      any of the phrases, it will be excluded from the list.
                    </Block>
                    <StringInput name="exclude" placeholder="example, example two" />
                  </RegularField>
                </>
              ) : null}
            </Section>
            <Preview />
          </div>
        </CardContent>
      </Card>
    </Form>
  );
};

const Preview = () => {
  const { data } = useForm(sourceSchema);
  const [tab, setTab] = useState<"overview" | "items" | "raw">("overview");
  return (
    <Section title={<Heading>Preview</Heading>}>
      <TabSet
        items={[
          {
            key: "overview",
            label: "Overview",
            onClick: () => {
              setTab("overview");
            },
            selected: tab === "overview",
          },
          {
            key: "items",
            label: "Items",
            onClick: () => {
              setTab("items");
            },
            selected: tab === "items",
          },
          {
            key: "raw",
            label: "Raw Data",
            onClick: () => {
              setTab("raw");
            },
            selected: tab === "raw",
          },
        ]}
      />
      {v.is(sourceSchema, data) ? (
        <>
          <Specimen>
            <Source config={data} />
          </Specimen>
          <Specimen>
            <List sources={[data]} />
          </Specimen>
        </>
      ) : (
        <Inline font="regular-italic" hue="gray">
          Not configured
        </Inline>
      )}
    </Section>
  );
};
