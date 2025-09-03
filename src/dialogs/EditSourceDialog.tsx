"use client";

import { Dialog } from "@colonydb/anthill/Dialog";
import { Icon } from "@colonydb/anthill/Icon";
import useSWRMutation from "swr/mutation";
import { SourceForm } from "@/app/SourceForm";
import type { SourceConfig } from "@/index";
import { editSource } from "@/mutations/editSource";

type Props = {
  source: SourceConfig;
};

export const EditSourceDialog = ({ source }: Props) => {
  const { trigger } = useSWRMutation("lists", editSource);
  return (
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
            await trigger(source);
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
};
