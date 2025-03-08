import { useState } from "react";
import { v4 as uuid } from "uuid";
import type { ListConfig } from ".";
import List from "./List";

type Props = {
  onSubmit: (list: ListConfig) => void;
};

const AddList = ({ onSubmit }: Props) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [itemSelector, setItemSelector] = useState("");
  const [titleSelector, setTitleSelector] = useState("");
  const [itemFilter, setItemFilter] = useState("");
  const [linkSelector, setLinkSelector] = useState("");
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({
          id: uuid(),
          name,
          url,
          itemSelector,
          titleSelector,
          itemFilter,
          linkSelector,
        });
        setName("");
        setUrl("");
        setItemSelector("");
        setTitleSelector("");
        setItemFilter("");
        setLinkSelector("");
      }}
    >
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
          size={100}
        />
      </div>
      <div>
        <label htmlFor="url">URL</label>
        <input
          id="url"
          type="url"
          required
          value={url}
          onChange={(event) => {
            setUrl(event.target.value);
          }}
          size={100}
        />
      </div>
      <div>
        <label htmlFor="itemSelector">Item selector</label>
        <input
          id="itemSelector"
          type="text"
          required
          value={itemSelector}
          onChange={(event) => {
            setItemSelector(event.target.value);
          }}
          size={100}
        />
      </div>
      <div>
        <label htmlFor="titleSelector">Title selector</label>
        <input
          id="titleSelector"
          type="text"
          required
          value={titleSelector}
          onChange={(event) => {
            setTitleSelector(event.target.value);
          }}
          size={100}
        />
      </div>
      <div>
        <label htmlFor="itemFilter">Item filter</label>
        <input
          id="itemFilter"
          type="text"
          value={itemFilter}
          onChange={(event) => {
            setItemFilter(event.target.value);
          }}
          size={100}
        />
      </div>
      <div>
        <label htmlFor="linkSelector">Link selector</label>
        <input
          id="linkSelector"
          type="text"
          value={linkSelector}
          onChange={(event) => {
            setLinkSelector(event.target.value);
          }}
          size={100}
        />
      </div>
      {name.trim() === "" ||
      url.trim() === "" ||
      itemSelector.trim() === "" ||
      titleSelector.trim() === "" ? (
        <p>Required fields: Name, URL, Item selector and Title selector</p>
      ) : (
        <List
          name={name}
          itemSelector={itemSelector}
          url={url}
          itemFilter={itemFilter}
          linkSelector={linkSelector}
          titleSelector={titleSelector}
        />
      )}
      <div>
        <button type="submit">Add</button>
      </div>
    </form>
  );
};

export default AddList;
