import type { SourceConfig } from "..";

export const removeSource = async (key: string, { arg: source }: { arg: SourceConfig }) => {
  const current = JSON.parse(localStorage.getItem(key) ?? "[]") as Array<SourceConfig>;

  const value = current ? [...current.filter((x) => x.id !== source.id)] : [];

  localStorage.setItem("lists", JSON.stringify(value));

  return value;
};
