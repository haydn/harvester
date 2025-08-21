import { Button } from "@colonydb/anthill/Button";
import { RegularField } from "@colonydb/anthill/RegularField";
import { Stack } from "@colonydb/anthill/Stack";
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
          <input
            id="name"
            type="text"
            required
            value={list.name}
            onChange={(event) => {
              setList({ ...list, name: event.target.value });
            }}
            size={100}
            placeholder="Reddit"
            style={{ all: "revert" }}
          />
        </RegularField>
        <RegularField label="URL" name="url" required>
          <input
            id="url"
            type="url"
            required
            value={list.url}
            onChange={(event) => {
              setList({ ...list, url: event.target.value });
            }}
            size={100}
            placeholder="https://www.reddit.com/"
            style={{ all: "revert" }}
          />
        </RegularField>
        <RegularField label="Item Selector" name="itemSelector" required>
          <input
            id="itemSelector"
            type="text"
            required
            value={list.itemSelector}
            onChange={(event) => {
              setList({ ...list, itemSelector: event.target.value });
            }}
            size={100}
            placeholder="article"
            style={{ all: "revert" }}
          />
        </RegularField>
        <RegularField label="Title Selector" name="titleSelector">
          <input
            id="titleSelector"
            type="text"
            value={list.titleSelector}
            onChange={(event) => {
              setList({ ...list, titleSelector: event.target.value });
            }}
            size={100}
            placeholder="a"
            style={{ all: "revert" }}
          />
        </RegularField>
        <RegularField label="Link Selector" name="linkSelector">
          <input
            id="linkSelector"
            type="text"
            value={list.linkSelector}
            onChange={(event) => {
              setList({ ...list, linkSelector: event.target.value });
            }}
            size={100}
            placeholder="a"
            style={{ all: "revert" }}
          />
        </RegularField>
        <RegularField label="Include" name="include">
          <input
            id="include"
            type="text"
            value={list.include}
            onChange={(event) => {
              setList({ ...list, include: event.target.value });
            }}
            size={100}
            placeholder="example, example two"
            style={{ all: "revert" }}
          />
        </RegularField>
        <RegularField label="Exclude" name="exclude">
          <input
            id="exclude"
            type="text"
            value={list.exclude}
            onChange={(event) => {
              setList({ ...list, exclude: event.target.value });
            }}
            size={100}
            placeholder="example, example two"
            style={{ all: "revert" }}
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
