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
import { listFetcher } from "@/fetchers/listFetcher";
import type { SourceConfig } from "@/index";
import SourceItems from "./SourceItems";
import SourceOverview from "./SourceOverview";

const HomePage = () => {
  const {
    data: sources,
    error,
    isLoading,
  } = useSWR<Array<SourceConfig>, Error>("lists", listFetcher);

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
            columnRule: "var(--context-border)",
            gridTemplateColumns: "minmax(min-content, 10rlh) minmax(min-content, 1fr)",
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
                  <li key={source.id}>
                    <SourceOverview
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
                          hue="gray"
                          title="Edit"
                        />
                      }
                      config={source}
                    />
                  </li>
                ))}
            </Stack>
          </Section>
          <MultiColumnStack allowBreaks columns="30ch">
            <SourceItems sources={sources ?? []} />
          </MultiColumnStack>
        </div>
      )}
    </div>
  );
};

export default HomePage;
