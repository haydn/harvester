"use client";

import type { FormAction } from "@colonydb/anthill";
import { Button } from "@colonydb/anthill/Button";
import { Card } from "@colonydb/anthill/Card";
import { CardContent } from "@colonydb/anthill/CardContent";
import { Dialog } from "@colonydb/anthill/Dialog";
import { DialogHeader } from "@colonydb/anthill/DialogHeader";
import { Form } from "@colonydb/anthill/Form";
import { FormFooter } from "@colonydb/anthill/FormFooter";
import { Heading } from "@colonydb/anthill/Heading";
import { Icon } from "@colonydb/anthill/Icon";
import { useCallback } from "react";
import useSWRMutation from "swr/mutation";
import { v4 as uuid } from "uuid";
import { SourceConfigurationFieldSet } from "@/components/SourceConfigurationFieldSet";
import { SourcePreview } from "@/components/SourcePreview";
import { addSource } from "@/mutations/addSource";
import { sourceConfigSchema } from "@/schemas/sourceConfigSchema";
import styles from "./AddSourceDialog.module.css";

export const AddSourceDialog = () => {
  const { trigger } = useSWRMutation("lists", addSource);

  const action = useCallback<FormAction<typeof sourceConfigSchema>>(
    async ({ data }) => {
      trigger(data);
      return {
        data,
        ok: true,
      };
    },
    [trigger],
  );

  return (
    <Dialog
      dismissible
      icon={<Icon symbol="Add" />}
      render={(closeDialog) => (
        <Form
          action={action}
          onSuccess={() => {
            setTimeout(() => {
              closeDialog();
            }, 1000);
          }}
          id="addSource"
          initialData={{
            exclude: "",
            id: uuid(),
            include: "",
            itemSelector: "",
            linkSelector: "",
            name: "",
            titleSelector: "",
            url: "",
          }}
          schema={sourceConfigSchema}
        >
          <Card
            header={
              <DialogHeader close={closeDialog}>
                <Heading>Add Source</Heading>
              </DialogHeader>
            }
            footer={
              <FormFooter
                actionLabel="Save"
                secondaryAction={<Button onClick={closeDialog}>Cancel</Button>}
              />
            }
          >
            <CardContent>
              <div className={styles.container}>
                <div className={styles.content}>
                  <SourceConfigurationFieldSet />
                  <SourcePreview />
                </div>
              </div>
            </CardContent>
          </Card>
        </Form>
      )}
      hue="gray"
      width="large"
    >
      Add
    </Dialog>
  );
};
