"use client";

import useSWR from "swr/immutable";
import { v4 as uuid } from "uuid";
import type { ListConfig } from ".";
import Dialog from "./Dialog";
import List from "./List";
import ListForm from "./ListForm";

const fetcher = (key: string) => {
  const value = localStorage.getItem(key);
  return value === null ? null : JSON.parse(value);
};

const HomePage = () => {
  const {
    data: lists,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<Array<ListConfig>>("lists", fetcher);

  const addList = (list: ListConfig) =>
    mutate(
      async (current) => {
        const value = current ? [...current, list] : [list];
        localStorage.setItem("lists", JSON.stringify(value));
        return value;
      },
      { revalidate: false },
    );

  const updateList = (list: ListConfig) =>
    mutate(
      async (current) => {
        const value = current ? [...current.filter((x) => x.id !== list.id), list] : [list];
        localStorage.setItem("lists", JSON.stringify(value));
        return value;
      },
      { revalidate: false },
    );

  const deleteList = (list: ListConfig) =>
    mutate(
      async (current) => {
        const value = current ? [...current.filter((x) => x.id !== list.id)] : [];
        localStorage.setItem("lists", JSON.stringify(value));
        return value;
      },
      { revalidate: false },
    );

  if (isLoading) return "One sec…";
  if (isValidating) return "One sec…";
  if (error) return ":(";

  return (
    <div>
      {(lists ?? []).map((list) => (
        <div key={list.id}>
          <List {...list} />
          <Dialog
            render={(closeDialog) => (
              <button
                onClick={() => {
                  deleteList(list);
                  closeDialog();
                }}
                type="button"
              >
                Confirm
              </button>
            )}
          >
            Remove list
          </Dialog>

          <Dialog
            render={(closeDialog) => (
              <ListForm
                list={list}
                onSubmit={(list) => {
                  updateList(list);
                  closeDialog();
                }}
              />
            )}
          >
            Edit list
          </Dialog>
        </div>
      ))}
      <hr />
      <Dialog
        render={(closeDialog) => (
          <ListForm
            list={{
              id: uuid(),
              include: "",
              itemSelector: "",
              linkSelector: "",
              name: "",
              titleSelector: "",
              url: "",
            }}
            onSubmit={(list) => {
              addList(list);
              closeDialog();
            }}
          />
        )}
      >
        Add list
      </Dialog>
    </div>
  );
};

export default HomePage;
