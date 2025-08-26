"use client";

import { Action } from "@colonydb/anthill/Action";
import { ActionSet } from "@colonydb/anthill/ActionSet";
import { Button } from "@colonydb/anthill/Button";
import { Card } from "@colonydb/anthill/Card";
import { CardContent } from "@colonydb/anthill/CardContent";
import { Dialog } from "@colonydb/anthill/Dialog";
import { Form } from "@colonydb/anthill/Form";
import { FormFooter } from "@colonydb/anthill/FormFooter";
import { Header } from "@colonydb/anthill/Header";
import { Heading } from "@colonydb/anthill/Heading";
import { Icon } from "@colonydb/anthill/Icon";
import { MultiColumnStack } from "@colonydb/anthill/MultiColumnStack";
import { Section } from "@colonydb/anthill/Section";
import Image from "next/image";
import useSWR from "swr/immutable";
import { v4 as uuid } from "uuid";
import * as v from "valibot";
import type { ListConfig } from ".";
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

  const addList = async (list: ListConfig) =>
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
          list,
        );
        const value = current ? [...current, list] : [list];
        localStorage.setItem("lists", JSON.stringify(value));
        return value;
      },
      { revalidate: false },
    );

  const updateList = async (list: ListConfig) =>
    mutate(
      async (current) => {
        const value = current ? [...current.filter((x) => x.id !== list.id), list] : [list];
        localStorage.setItem("lists", JSON.stringify(value));
        return value;
      },
      { revalidate: false },
    );

  const deleteList = async (list: ListConfig) =>
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
        <div style={{ background: "light-dark(var(--color-gray-t3), var(--color-gray-s3))" }}>
          <Header
            actions={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  paddingInlineEnd: "1rlh",
                  height: "100%",
                }}
              >
                <Dialog
                  dismissible
                  icon={<Icon symbol="Add" />}
                  render={(closeDialog) => (
                    <ListForm
                      id="newList"
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
                      onCancel={() => {
                        closeDialog();
                      }}
                      onSubmit={async (list) => {
                        await addList(list);
                      }}
                      onSuccess={() => {
                        setTimeout(() => {
                          closeDialog();
                        }, 1000);
                      }}
                      title="Add List"
                    />
                  )}
                  width="medium"
                >
                  Add list
                </Dialog>
              </div>
            }
          >
            <Heading>
              <Image src="/harvester-640x640.png" alt="Harvester" height={55} width={55} />
            </Heading>
          </Header>
        </div>
      }
    >
      <div style={{ padding: "0 1rlh 1rlh" }}>
        <MultiColumnStack allowBreaks columns="30ch">
          {(lists ?? [])
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((list) => (
              <List
                actions={
                  <ActionSet
                    actions={[
                      {
                        content: (
                          <Dialog
                            dismissible
                            icon={<Icon symbol="Remove" />}
                            padded
                            render={(closeDialog) => (
                              <Form
                                action={async () => {
                                  await deleteList(list);
                                  return {
                                    ok: true,
                                    data: {},
                                  };
                                }}
                                onSuccess={() => {
                                  closeDialog();
                                }}
                                id={`deleteList:${list.id}`}
                                initialData={{}}
                                schema={v.object({})}
                              >
                                <Card
                                  header={
                                    <Header
                                      actions={
                                        <Action
                                          fontSize="subheading"
                                          icon={<Icon symbol="Remove" />}
                                          onClick={() => {
                                            closeDialog();
                                          }}
                                          title="close"
                                        />
                                      }
                                    >
                                      <Heading>Remove List</Heading>
                                    </Header>
                                  }
                                  footer={
                                    <FormFooter
                                      actionLabel="Confirm"
                                      dangerous
                                      secondaryAction={
                                        <Button
                                          onClick={() => {
                                            closeDialog();
                                          }}
                                        >
                                          Cancel
                                        </Button>
                                      }
                                    />
                                  }
                                >
                                  <CardContent>
                                    Are you sure you want to remove this list?
                                  </CardContent>
                                </Card>
                              </Form>
                            )}
                            width="narrow"
                          >
                            Remove list
                          </Dialog>
                        ),
                        key: "remove",
                      },
                      {
                        content: (
                          <Dialog
                            dismissible
                            icon={<Icon symbol="Add" />}
                            padded
                            render={(closeDialog) => (
                              <ListForm
                                id={`editList:${list.id}`}
                                list={list}
                                onCancel={() => {
                                  closeDialog();
                                }}
                                onSubmit={async (list) => {
                                  await updateList(list);
                                }}
                                onSuccess={() => {
                                  setTimeout(() => {
                                    closeDialog();
                                  }, 1000);
                                }}
                                title="Edit List"
                              />
                            )}
                            width="medium"
                          >
                            Edit list
                          </Dialog>
                        ),
                        key: "edit",
                      },
                    ]}
                    title="Edit"
                  />
                }
                key={list.id}
                {...list}
              />
            ))}
        </MultiColumnStack>
      </div>
    </Section>
  );
};

export default HomePage;
