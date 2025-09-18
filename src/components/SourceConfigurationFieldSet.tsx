"use client";

import { Block } from "@colonydb/anthill/Block";
import { Heading } from "@colonydb/anthill/Heading";
import { RegularField } from "@colonydb/anthill/RegularField";
import { Section } from "@colonydb/anthill/Section";
import { Stack } from "@colonydb/anthill/Stack";
import { StringInput } from "@colonydb/anthill/StringInput";
import { TabBlock } from "@colonydb/anthill/TabBlock";

export const SourceConfigurationFieldSet = () => (
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
