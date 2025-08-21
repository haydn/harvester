"use client";

import { Button } from "@colonydb/anthill/Button";
import { Card } from "@colonydb/anthill/Card";
import { CardContent } from "@colonydb/anthill/CardContent";
import { Dialog } from "@colonydb/anthill/Dialog";
import { Header } from "@colonydb/anthill/Header";
import { Heading } from "@colonydb/anthill/Heading";
import { Icon } from "@colonydb/anthill/Icon";
import { Section } from "@colonydb/anthill/Section";
import { Stack } from "@colonydb/anthill/Stack";
import useSWR from "swr/immutable";
import { v4 as uuid } from "uuid";
import type { ListConfig } from ".";
// import Dialog from "./Dialog";
import List from "./List";
import ListForm from "./ListForm";

const fetcher = (key: string) => {
  const value = localStorage.getItem(key);
  return value === null ? null : JSON.parse(value);
};

const HomePage = () => {
  const {
    data: lists,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<Array<ListConfig>>("lists", fetcher);

  const addList = (list: ListConfig) =>
    mutate(
      async (current) => {
        const value = current ? [...current, list] : [list];
        localStorage.setItem("lists", JSON.stringify(value));
        return value;
      },
      { revalidate: false },
    );

  const updateList = (list: ListConfig) =>
    mutate(
      async (current) => {
        const value = current ? [...current.filter((x) => x.id !== list.id), list] : [list];
        localStorage.setItem("lists", JSON.stringify(value));
        return value;
      },
      { revalidate: false },
    );

  const deleteList = (list: ListConfig) =>
    mutate(
      async (current) => {
        const value = current ? [...current.filter((x) => x.id !== list.id)] : [];
        localStorage.setItem("lists", JSON.stringify(value));
        return value;
      },
      { revalidate: false },
    );

  if (isLoading) return "One sec…";
  if (isValidating) return "One sec…";
  if (error) return ":(";

  return (
    <Section
      title={
        <Header
          actions={
            <Dialog
              dismissible
              icon={<Icon symbol="Add" />}
              render={(closeDialog) => (
                <Card header={<Heading>Add List</Heading>}>
                  <CardContent>
                    <ListForm
                      list={{
                        exclude: "",
                        id: uuid(),
                        include: "",
                        itemSelector: "",
                        linkSelector: "",
                        name: "",
                        titleSelector: "",
                        url: "",
                      }}
                      onSubmit={(list) => {
                        addList(list);
                        closeDialog();
                      }}
                    />
                  </CardContent>
                </Card>
              )}
            >
              Add list
            </Dialog>
          }
        >
          <Heading>Harvester</Heading>
        </Header>
      }
    >
      <div
        style={{
          columns: "20rem",
          gap: "2rlh",
        }}
      >
        <Stack>
          {(lists ?? [])
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((list) => (
              <div key={list.id} style={{ breakInside: "avoid" }}>
                <List
                  actions={
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <Dialog
                        dismissible
                        icon={<Icon symbol="Remove" />}
                        render={(closeDialog) => (
                          <Card
                            header={<Heading>Remove List</Heading>}
                            footer={
                              <>
                                <Button
                                  dangerous
                                  onClick={() => {
                                    deleteList(list);
                                    closeDialog();
                                  }}
                                  submit
                                >
                                  Confirm
                                </Button>
                                <Button
                                  onClick={() => {
                                    closeDialog();
                                  }}
                                >
                                  Cancel
                                </Button>
                              </>
                            }
                          >
                            <CardContent>Are you sure you want to remove this list?</CardContent>
                          </Card>
                        )}
                        width="narrow"
                      >
                        Remove list
                      </Dialog>
                      <Dialog
                        dismissible
                        icon={<Icon symbol="Add" />}
                        render={(closeDialog) => (
                          <Card header={<Heading>Edit List</Heading>}>
                            <CardContent>
                              <ListForm
                                list={list}
                                onSubmit={(list) => {
                                  updateList(list);
                                  closeDialog();
                                }}
                              />
                            </CardContent>
                          </Card>
                        )}
                      >
                        Edit list
                      </Dialog>
                    </div>
                  }
                  {...list}
                />
              </div>
            ))}
        </Stack>
      </div>
    </Section>
  );
};

export default HomePage;
