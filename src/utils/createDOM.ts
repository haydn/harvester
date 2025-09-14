import { JSDOM, VirtualConsole } from "jsdom";

export const createDOM = async (html: string, url: string) => {
  const virtualConsole = new VirtualConsole();
  try {
    return new JSDOM(html, { url, virtualConsole });
  } catch {
    return null;
  }
};
