"use client";

import { Dialog } from "@colonydb/anthill/Dialog";
import { Icon } from "@colonydb/anthill/Icon";
import { v4 as uuid } from "uuid";
import { SourceForm } from "@/app/SourceForm";
import type { SourceConfig } from "@/index";

type Props = {
  add: (source: SourceConfig) => Promise<unknown>;
};

export const AddSourceDialog = ({ add }: Props) => (
  <Dialog
    dismissible
    icon={<Icon symbol="Add" />}
    render={(closeDialog) => (
      <SourceForm
        id="newSource"
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
        onCancel={() => {
          closeDialog();
        }}
        onSubmit={async (source) => {
          await add(source);
        }}
        onSuccess={() => {
          setTimeout(() => {
            closeDialog();
          }, 1000);
        }}
        title="Add Source"
      />
    )}
    color={["gray-s1", "gray-t1"]}
    width="medium"
  >
    Add
  </Dialog>
);
