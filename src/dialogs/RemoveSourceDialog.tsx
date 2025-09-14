"use client";

import { Button } from "@colonydb/anthill/Button";
import { Card } from "@colonydb/anthill/Card";
import { CardContent } from "@colonydb/anthill/CardContent";
import { Dialog } from "@colonydb/anthill/Dialog";
import { DialogHeader } from "@colonydb/anthill/DialogHeader";
import { Form } from "@colonydb/anthill/Form";
import { FormFooter } from "@colonydb/anthill/FormFooter";
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
              <DialogHeader close={closeDialog}>
                <Heading>Remove Source</Heading>
              </DialogHeader>
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
      width="small"
    >
      Remove
    </Dialog>
  );
};
