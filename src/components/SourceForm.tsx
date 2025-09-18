"use client";

import type { FormAction } from "@colonydb/anthill";
import { Button } from "@colonydb/anthill/Button";
import { Card } from "@colonydb/anthill/Card";
import { CardContent } from "@colonydb/anthill/CardContent";
import { DialogHeader } from "@colonydb/anthill/DialogHeader";
import { Form } from "@colonydb/anthill/Form";
import { FormFooter } from "@colonydb/anthill/FormFooter";
import { Heading } from "@colonydb/anthill/Heading";
import { useCallback } from "react";
import type { SourceConfig } from "@/index";
import { sourceConfigSchema } from "@/schemas/sourceConfigSchema";
import { SourceConfigurationFieldSet } from "./SourceConfigurationFieldSet";
import { SourcePreview } from "./SourcePreview";

type Props = {
  id: string;
  initialData: SourceConfig;
  onCancel: () => void;
  onSubmit: (list: SourceConfig) => void;
  onSuccess: () => void;
  title: string;
};

export const SourceForm = ({ id, initialData, onCancel, onSubmit, onSuccess, title }: Props) => {
  const action = useCallback<FormAction<typeof sourceConfigSchema>>(
    async ({ data }) => {
      onSubmit(data);
      return {
        data,
        ok: true,
      };
    },
    [onSubmit],
  );
  return (
    <Form
      action={action}
      onSuccess={onSuccess}
      id={id}
      initialData={initialData}
      schema={sourceConfigSchema}
    >
      <Card
        header={
          <DialogHeader close={onCancel}>
            <Heading>{title}</Heading>
          </DialogHeader>
        }
        footer={
          <FormFooter
            actionLabel="Save"
            secondaryAction={<Button onClick={onCancel}>Cancel</Button>}
          />
        }
      >
        <CardContent>
          <div
            style={{
              gap: "calc(var(--context-spacing) * 2)",
              display: "grid",
              columnRule: "var(--context-border)",
              gridTemplateColumns:
                "calc(var(--width-small) - var(--context-spacing) * 2) calc(var(--width-medium) - var(--context-spacing) * 2)",
            }}
          >
            <SourceConfigurationFieldSet />
            <SourcePreview />
          </div>
        </CardContent>
      </Card>
    </Form>
  );
};
