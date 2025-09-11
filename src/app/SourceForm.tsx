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
import { RegularField } from "@colonydb/anthill/RegularField";
import { Section } from "@colonydb/anthill/Section";
import { Specimen } from "@colonydb/anthill/Specimen";
import { Stack } from "@colonydb/anthill/Stack";
import { StringInput } from "@colonydb/anthill/StringInput";
import { TabBlock } from "@colonydb/anthill/TabBlock";
import { useForm } from "@colonydb/anthill/useForm";
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

export const SourceForm = ({ id, initialData, onCancel, onSubmit, onSuccess, title }: Props) => (
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
            columnRule: "var(--context-border)",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          }}
        >
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
                              CSS selector applied to each item to identify its title. If not
                              provided, the text of the entire item will be used.
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
                              CSS selector applied to each item to identify its link. If not
                              provided, the items itself will be used.
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
                              A comma-separated list of phrases to filter the items by. If an item
                              does not contain any of the phrases, it will be excluded from the
                              list.
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
                              A comma-separated list of phrases to filter the items by. If an item
                              contains any of the phrases, it will be excluded from the list.
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
          <Preview />
        </div>
      </CardContent>
    </Card>
  </Form>
);

const Preview = () => {
  const { data } = useForm(sourceSchema);
  return (
    <Section title={<Heading>Preview</Heading>}>
      <TabBlock
        items={[
          {
            key: "overview",
            label: "Overview",
            content: v.is(sourceSchema, data) ? (
              <Stack>
                <Specimen>
                  <Source config={data} />
                </Specimen>
                <Specimen>
                  <List sources={[data]} />
                </Specimen>
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
          },
          {
            key: "raw",
            label: "Raw Data",
          },
        ]}
        seamless
      />
    </Section>
  );
};
