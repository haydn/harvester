export type Item = {
  firstSeen: string;
  title: string;
  url: string | undefined;
};

export type SourceConfig = {
  exclude?: string;
  id: string;
  include?: string;
  itemSelector: string;
  linkSelector?: string;
  name: string;
  titleSelector?: string;
  url: string;
};

export type SourceResult = {
  debug: {
    itemsFound: number;
    itemsAfterFilter: number;
    firstTitle: string | undefined;
    firstLink: string | undefined;
  };
  fetchedAt: string;
  items: Array<Item>;
};
