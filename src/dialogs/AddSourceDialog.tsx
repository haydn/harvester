"use client";

import { Dialog } from "@colonydb/anthill/Dialog";
import { Icon } from "@colonydb/anthill/Icon";
import useSWRMutation from "swr/mutation";
import { v4 as uuid } from "uuid";
import { SourceForm } from "@/app/SourceForm";
import { addSource } from "@/mutations/addSource";

export const AddSourceDialog = () => {
  const { trigger } = useSWRMutation("lists", addSource);
  return (
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
            await trigger(source);
          }}
          onSuccess={() => {
            setTimeout(() => {
              closeDialog();
            }, 1000);
          }}
          title="Add Source"
        />
      )}
      hue="gray"
      width="medium"
    >
      Add
    </Dialog>
  );
};
