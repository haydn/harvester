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
      <div>
        <label htmlFor="include">Include</label>
        <input
          id="include"
          type="text"
          value={list.include}
          onChange={(event) => {
            setList({ ...list, include: event.target.value });
          }}
          size={100}
          placeholder="example, example two"
        />
      </div>
      <div>
        <label htmlFor="exclude">Exclude</label>
        <input
          id="exclude"
          type="text"
          value={list.exclude}
          onChange={(event) => {
            setList({ ...list, exclude: event.target.value });
          }}
          size={100}
          placeholder="example, example two"
        />
      </div>
      {list.name.trim() === "" || list.url.trim() === "" || list.itemSelector.trim() === "" ? (
        <p>Required fields: Name, URL and Item selector</p>
      ) : (
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
        <button type="submit">Save</button>
      </div>
    </form>
  );
};

export default ListForm;
