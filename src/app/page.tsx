"use client";

import { ActionSet } from "@colonydb/anthill/ActionSet";
import { Header } from "@colonydb/anthill/Header";
import { Heading } from "@colonydb/anthill/Heading";
import { MultiColumnStack } from "@colonydb/anthill/MultiColumnStack";
import { Section } from "@colonydb/anthill/Section";
import { Stack } from "@colonydb/anthill/Stack";
import useSWR from "swr/immutable";
import SourceItems from "@/components/SourceItems";
import SourceOverview from "@/components/SourceOverview";
import { AddSourceDialog } from "@/dialogs/AddSourceDialog";
import { EditSourceDialog } from "@/dialogs/EditSourceDialog";
import { RemoveSourceDialog } from "@/dialogs/RemoveSourceDialog";
import { listFetcher } from "@/fetchers/listFetcher";
import type { SourceConfig } from "@/index";
import styles from "./page.module.css";

const HomePage = () => {
  const {
    data: sources,
    error,
    isLoading,
  } = useSWR<Array<SourceConfig>, Error>("lists", listFetcher);

  return (
    <div className={styles.container}>
      {isLoading ? (
        "Loading…"
      ) : error ? (
        error.message
      ) : (
        <div className={styles.content}>
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
                      autoRefresh
                      config={source}
                    />
                  </li>
                ))}
            </Stack>
          </Section>
          <MultiColumnStack allowBreaks columns="30ch">
            <Section title={<Heading>Items</Heading>}>
              <SourceItems sources={sources ?? []} />
            </Section>
          </MultiColumnStack>
        </div>
      )}
    </div>
  );
};

export default HomePage;
