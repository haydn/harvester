"use client";

import { Action } from "@colonydb/anthill/Action";
import { Button } from "@colonydb/anthill/Button";
import { Card } from "@colonydb/anthill/Card";
import { CardContent } from "@colonydb/anthill/CardContent";
import { Dialog } from "@colonydb/anthill/Dialog";
import { Form } from "@colonydb/anthill/Form";
import { FormFooter } from "@colonydb/anthill/FormFooter";
import { Header } from "@colonydb/anthill/Header";
import { Heading } from "@colonydb/anthill/Heading";
import { Icon } from "@colonydb/anthill/Icon";
import useSWRMutation from "swr/mutation";
import * as v from "valibot";
import type { SourceConfig } from "@/index";
import { removeSource } from "@/mutations/removeSource";

type Props = {
  source: SourceConfig;
};

export const RemoveSourceDialog = ({ source }: Props) => {
  const { trigger } = useSWRMutation("lists", removeSource);
  return (
    <Dialog
      dismissible
      icon={<Icon symbol="Remove" />}
      padded
      render={(closeDialog) => (
        <Form
          action={async () => {
            await trigger(source);
            return {
              ok: true,
              data: {},
            };
          }}
          onSuccess={() => {
            closeDialog();
          }}
          id={`deleteSource:${source.id}`}
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
                <Heading>Remove Source</Heading>
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
            <CardContent>Are you sure you want to remove this source?</CardContent>
          </Card>
        </Form>
      )}
      width="narrow"
    >
      Remove
    </Dialog>
  );
};
