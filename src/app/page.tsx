"use client";

import { ActionSet } from "@colonydb/anthill/ActionSet";
import { Header } from "@colonydb/anthill/Header";
import { Heading } from "@colonydb/anthill/Heading";
import { MultiColumnStack } from "@colonydb/anthill/MultiColumnStack";
import { Section } from "@colonydb/anthill/Section";
import { Stack } from "@colonydb/anthill/Stack";
import Image from "next/image";
import { useCallback } from "react";
import useSWR from "swr/immutable";
import * as v from "valibot";
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
    mutate,
  } = useSWR<Array<SourceConfig>, Error>("lists", configFetcher);

  const addSource = useCallback(
    async (source: SourceConfig) =>
      mutate(
        async (current) => {
          v.parse(
            v.object({
              exclude: v.optional(v.string()),
              id: v.string(),
              include: v.optional(v.string()),
              itemSelector: v.pipe(v.string(), v.nonEmpty()),
              linkSelector: v.optional(v.string()),
              name: v.pipe(v.string(), v.nonEmpty()),
              titleSelector: v.optional(v.string()),
              url: v.pipe(v.string(), v.nonEmpty(), v.url()),
            }),
            source,
          );
          const value = current ? [...current, source] : [source];
          localStorage.setItem("lists", JSON.stringify(value));
          return value;
        },
        { revalidate: false },
      ),
    [mutate],
  );

  const updateSource = useCallback(
    async (source: SourceConfig) =>
      mutate(
        async (current) => {
          const value = current ? [...current.filter((x) => x.id !== source.id), source] : [source];
          localStorage.setItem("lists", JSON.stringify(value));
          return value;
        },
        { revalidate: false },
      ),
    [mutate],
  );

  const deleteSource = useCallback(
    async (source: SourceConfig) =>
      mutate(
        async (current) => {
          const value = current ? [...current.filter((x) => x.id !== source.id)] : [];
          localStorage.setItem("lists", JSON.stringify(value));
          return value;
        },
        { revalidate: false },
      ),
    [mutate],
  );

  return (
    <Section
      title={
        <div style={{ background: "light-dark(var(--color-gray-t3), var(--color-gray-s3))" }}>
          <Header>
            <Heading>
              <Image src="/harvester-640x640.png" alt="Harvester" height={55} width={55} />
            </Heading>
          </Header>
        </div>
      }
      spacing="p1"
    >
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
                <Header actions={<AddSourceDialog add={addSource} />}>
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
                              content: <EditSourceDialog source={source} update={updateSource} />,
                              key: "edit",
                            },
                            {
                              content: <RemoveSourceDialog source={source} remove={deleteSource} />,
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
    </Section>
  );
};

export default HomePage;
