export type ListConfig = {
  exclude?: string;
  id: string;
  include?: string;
  itemSelector: string;
  linkSelector?: string;
  name: string;
  titleSelector?: string;
  url: string;
};

export type ListResult = {
  items: Array<{ title: string; url: string | undefined }>;
  debug: {
    itemsFound: number;
    itemsAfterFilter: number;
    firstTitle: string | undefined;
    firstLink: string | undefined;
  };
};
