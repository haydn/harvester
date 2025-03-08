"use client";

import { useRef } from "react";
import List from "./List";
import useLocalStorage from "use-local-storage";
import AddList from "./AddList";

const HomePage = () => {
  const [lists, setLists] = useLocalStorage<
    Array<{
      id: string;
      name: string;
      url: string;
      itemSelector: string;
      itemFilter?: string;
      titleSelector?: string;
      linkSelector?: string;
    }>
  >("lists", []);

  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <div>
      {lists.map(({ id, ...list }) => (
        <div key={id}>
          <List {...list} />
          <button
            onClick={() => {
              setLists(lists.filter((list) => list.id !== id));
            }}
          >
            Remove list
          </button>
        </div>
      ))}
      <dialog ref={dialogRef}>
        <button
          onClick={() => {
            if (dialogRef.current) dialogRef.current.close();
          }}
        >
          Close
        </button>
        <AddList
          onSubmit={(list) => {
            setLists([...lists, list]);
            if (dialogRef.current) dialogRef.current.close();
          }}
        />
      </dialog>
      <button
        onClick={() => {
          if (dialogRef.current) dialogRef.current.showModal();
        }}
      >
        Add list
      </button>
    </div>
  );
};

export default HomePage;
