import { Button } from "@colonydb/anthill/Button";
import { RegularField } from "@colonydb/anthill/RegularField";
import { Stack } from "@colonydb/anthill/Stack";
import { StringInput } from "@colonydb/anthill/StringInput";
import { useState } from "react";
import type { ListConfig } from ".";
import List from "./List";

type Props = {
  list: ListConfig;
  onSubmit: (list: ListConfig) => void;
};

const ListForm = ({ list: initialList, onSubmit }: Props) => {
  const [list, setList] = useState(initialList);
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(list);
      }}
    >
      <Stack>
        <RegularField label="Name" name="name" required>
          <StringInput
            name="name"
            placeholder="Reddit"
            setValue={(name) => {
              setList({ ...list, name });
            }}
            value={list.name}
          />
        </RegularField>
        <RegularField label="URL" name="url" required>
          <StringInput
            name="url"
            placeholder="https://www.reddit.com/"
            setValue={(url) => {
              setList({ ...list, url });
            }}
            value={list.url}
          />
        </RegularField>
        <RegularField label="Item Selector" name="itemSelector" required>
          <StringInput
            name="itemSelector"
            placeholder="article"
            setValue={(itemSelector) => {
              setList({ ...list, itemSelector });
            }}
            value={list.itemSelector}
          />
        </RegularField>
        <RegularField label="Title Selector" name="titleSelector">
          <StringInput
            name="titleSelector"
            placeholder="a"
            setValue={(titleSelector) => {
              setList({ ...list, titleSelector });
            }}
            value={list.titleSelector}
          />
        </RegularField>
        <RegularField label="Link Selector" name="linkSelector">
          <StringInput
            name="linkSelector"
            placeholder="a"
            setValue={(linkSelector) => {
              setList({ ...list, linkSelector });
            }}
            value={list.linkSelector}
          />
        </RegularField>
        <RegularField label="Include" name="include">
          <StringInput
            name="include"
            placeholder="example, example two"
            setValue={(include) => {
              setList({ ...list, include });
            }}
            value={list.include}
          />
        </RegularField>
        <RegularField label="Exclude" name="exclude">
          <StringInput
            name="exclude"
            placeholder="example, example two"
            setValue={(exclude) => {
              setList({ ...list, exclude });
            }}
            value={list.exclude}
          />
        </RegularField>
        {list.name.trim() === "" ||
        list.url.trim() === "" ||
        list.itemSelector.trim() === "" ? null : (
          <List
            exclude={list.exclude}
            include={list.include}
            itemSelector={list.itemSelector}
            linkSelector={list.linkSelector}
            name={list.name}
            titleSelector={list.titleSelector}
            url={list.url}
          />
        )}
        <div>
          <Button submit>Save</Button>
        </div>
      </Stack>
    </form>
  );
};

export default ListForm;
