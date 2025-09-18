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
import { SourceConfigurationFieldSet } from "@/components/SourceConfigurationFieldSet";
import { SourcePreview } from "@/components/SourcePreview";
import type { SourceConfig } from "@/index";
import { editSource } from "@/mutations/editSource";
import { sourceConfigSchema } from "@/schemas/sourceConfigSchema";
import styles from "./EditSourceDialog.module.css";

type Props = {
  source: SourceConfig;
};

export const EditSourceDialog = ({ source }: Props) => {
  const { trigger } = useSWRMutation("lists", editSource);

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
      icon={<Icon symbol="Edit" />}
      padded
      render={(closeDialog) => (
        <Form
          action={action}
          onSuccess={() => {
            setTimeout(() => {
              closeDialog();
            }, 1000);
          }}
          id={`editSource:${source.id}`}
          initialData={source}
          schema={sourceConfigSchema}
        >
          <Card
            header={
              <DialogHeader close={closeDialog}>
                <Heading>Edit Source</Heading>
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
      width="large"
    >
      Edit
    </Dialog>
  );
};
