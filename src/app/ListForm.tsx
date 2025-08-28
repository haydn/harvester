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
import { StringInput } from "@colonydb/anthill/StringInput";
import { TabSet } from "@colonydb/anthill/TabSet";
import { useForm } from "@colonydb/anthill/useForm";
import { useState } from "react";
import * as v from "valibot";
import type { ListConfig } from ".";
import List from "./List";

type Props = {
  id: string;
  list: ListConfig;
  onCancel: () => void;
  onSubmit: (list: ListConfig) => void;
  onSuccess: () => void;
  title: string;
};

const schema = v.object({
  exclude: v.optional(v.string()),
  id: v.string(),
  include: v.optional(v.string()),
  itemSelector: v.pipe(v.string(), v.nonEmpty()),
  linkSelector: v.optional(v.string()),
  name: v.pipe(v.string(), v.nonEmpty()),
  titleSelector: v.optional(v.string()),
  url: v.pipe(v.string(), v.nonEmpty(), v.url()),
});

const ListForm = ({ id, list: initialList, onCancel, onSubmit, onSuccess, title }: Props) => {
  const [tab, setTab] = useState<"basics" | "filters">("basics");
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
      initialData={initialList}
      schema={schema}
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
          <MultiColumnStack columns="30ch">
            <Section title={<Heading>Configuration</Heading>}>
              <TabSet
                items={[
                  {
                    key: "basics",
                    label: "Basics",
                    onClick: () => {
                      setTab("basics");
                    },
                    selected: tab === "basics",
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
              {tab === "basics" ? (
                <>
                  <RegularField label="Name" name="name" required>
                    <StringInput name="name" placeholder="Reddit" />
                  </RegularField>
                  <RegularField label="Page URL" name="url" required>
                    <StringInput name="url" placeholder="https://www.reddit.com/" />
                  </RegularField>
                  <RegularField label="Item Selector" name="itemSelector" required>
                    <Block font="tiny">
                      CSS selector identifying the items on the page to be listed.
                    </Block>
                    <StringInput name="itemSelector" placeholder="article" />
                  </RegularField>
                  <RegularField label="Item Title Selector" name="titleSelector">
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
          </MultiColumnStack>
        </CardContent>
      </Card>
    </Form>
  );
};

const Preview = () => {
  const { data } = useForm(schema);
  return (
    <Section title={<Heading>Preview</Heading>}>
      <Specimen>
        {v.is(schema, data) ? (
          <List
            debug
            exclude={data.exclude}
            include={data.include}
            itemSelector={data.itemSelector}
            linkSelector={data.linkSelector}
            name={data.name}
            titleSelector={data.titleSelector}
            url={data.url}
          />
        ) : (
          <Inline font="regular-italic" hue="gray">
            Not configured
          </Inline>
        )}
      </Specimen>
    </Section>
  );
};

export default ListForm;
