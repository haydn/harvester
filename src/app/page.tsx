"use client";

import { ActionSet } from "@colonydb/anthill/ActionSet";
import { Header } from "@colonydb/anthill/Header";
import { Heading } from "@colonydb/anthill/Heading";
import { MultiColumnStack } from "@colonydb/anthill/MultiColumnStack";
import { Section } from "@colonydb/anthill/Section";
import { Stack } from "@colonydb/anthill/Stack";
import useSWR from "swr/immutable";
import { AddSourceDialog } from "@/dialogs/AddSourceDialog";
import { EditSourceDialog } from "@/dialogs/EditSourceDialog";
import { RemoveSourceDialog } from "@/dialogs/RemoveSourceDialog";
import { configFetcher } from "@/fetchers/configFetcher";
import type { SourceConfig } from "@/index";
import List from "./List";
import Source from "./Source";

const HomePage = () => {
  const {
    data: sources,
    error,
    isLoading,
  } = useSWR<Array<SourceConfig>, Error>("lists", configFetcher);

  return (
    <div style={{ padding: "0 1rlh 1rlh" }}>
      {isLoading ? (
        "Loading…"
      ) : error ? (
        error.message
      ) : (
        <div
          style={{
            gap: "2rlh",
            display: "grid",
            columnRule: "1px solid currentColor",
            gridTemplateColumns: "minmax(0, 10rlh) minmax(0, 1fr)",
          }}
        >
          <Section
            title={
              <Header actions={<AddSourceDialog />}>
                <Heading>Sources</Heading>
              </Header>
            }
          >
            <Stack tagName="ul">
              {(sources ?? [])
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((source) => (
                  <Source
                    actions={
                      <ActionSet
                        actions={[
                          {
                            content: <EditSourceDialog source={source} />,
                            key: "edit",
                          },
                          {
                            content: <RemoveSourceDialog source={source} />,
                            key: "remove",
                          },
                        ]}
                        color={["gray-s1", "gray-t1"]}
                        title="Edit"
                      />
                    }
                    config={source}
                    key={source.id}
                  />
                ))}
            </Stack>
          </Section>
          <Section title={<Heading>Items</Heading>}>
            <MultiColumnStack allowBreaks columns="30ch">
              <List sources={sources ?? []} />
            </MultiColumnStack>
          </Section>
        </div>
      )}
    </div>
  );
};

export default HomePage;
