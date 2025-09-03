export const configFetcher = (key: string) => {
  const value = localStorage.getItem(key);
  return value === null ? null : JSON.parse(value);
};
