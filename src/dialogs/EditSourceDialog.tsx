"use client";

import { Dialog } from "@colonydb/anthill/Dialog";
import { Icon } from "@colonydb/anthill/Icon";
import { SourceForm } from "@/app/SourceForm";
import type { SourceConfig } from "@/index";

type Props = {
  source: SourceConfig;
  update: (source: SourceConfig) => Promise<unknown>;
};

export const EditSourceDialog = ({ source, update }: Props) => (
  <Dialog
    dismissible
    icon={<Icon symbol="Edit" />}
    padded
    render={(closeDialog) => (
      <SourceForm
        id={`editSource:${source.id}`}
        initialData={source}
        onCancel={() => {
          closeDialog();
        }}
        onSubmit={async (source) => {
          await update(source);
        }}
        onSuccess={() => {
          setTimeout(() => {
            closeDialog();
          }, 1000);
        }}
        title="Edit Source"
      />
    )}
    width="medium"
  >
    Edit
  </Dialog>
);
