export const select = (root: Document | Element, selector: string) => {
  try {
    return root.querySelector(selector);
  } catch {
    return null;
  }
};
