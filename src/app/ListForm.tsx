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
      <div>
        <label htmlFor="name">Name</label>
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
        />
      </div>
      <div>
        <label htmlFor="url">URL</label>
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
        />
      </div>
      <div>
        <label htmlFor="itemSelector">Item selector</label>
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
        />
      </div>
      <div>
        <label htmlFor="titleSelector">Title selector</label>
        <input
          id="titleSelector"
          type="text"
          value={list.titleSelector}
          onChange={(event) => {
            setList({ ...list, titleSelector: event.target.value });
          }}
          size={100}
          placeholder="a"
        />
      </div>
      <div>
        <label htmlFor="itemFilter">Item filter</label>
        <input
          id="itemFilter"
          type="text"
          value={list.itemFilter}
          onChange={(event) => {
            setList({ ...list, itemFilter: event.target.value });
          }}
          size={100}
          placeholder="example"
        />
      </div>
      <div>
        <label htmlFor="linkSelector">Link selector</label>
        <input
          id="linkSelector"
          type="text"
          value={list.linkSelector}
          onChange={(event) => {
            setList({ ...list, linkSelector: event.target.value });
          }}
          size={100}
          placeholder="a"
        />
      </div>
      {list.name.trim() === "" || list.url.trim() === "" || list.itemSelector.trim() === "" ? (
        <p>Required fields: Name, URL and Item selector</p>
      ) : (
        <List
          name={list.name}
          itemSelector={list.itemSelector}
          url={list.url}
          itemFilter={list.itemFilter}
          linkSelector={list.linkSelector}
          titleSelector={list.titleSelector}
        />
      )}
      <div>
        <button type="submit">Save</button>
      </div>
    </form>
  );
};

export default ListForm;
