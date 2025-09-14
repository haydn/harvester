export const selectAll = (root: Document | Element, selector: string) => {
  try {
    return root.querySelectorAll(selector);
  } catch {
    return [];
  }
};
