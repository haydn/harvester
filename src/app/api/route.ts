import { JSDOM } from "jsdom";
import type { ListResult } from "..";

export const GET = async (request: Request) => {
  const requestUrl = URL.parse(request.url);

  const include = requestUrl?.searchParams.get("include");
  const exclude = requestUrl?.searchParams.get("exclude");
  const itemSelector = requestUrl?.searchParams.get("itemSelector");
  const titleSelector = requestUrl?.searchParams.get("titleSelector");
  const linkSelector = requestUrl?.searchParams.get("linkSelector");
  const url = requestUrl?.searchParams.get("url");

  if (url === null || url === undefined) {
    return new Response("Missing URL query param", { status: 400 });
  }

  if (itemSelector === null || itemSelector === undefined || itemSelector.trim() === "") {
    return new Response("Missing itemSelector query param", { status: 400 });
  }

  const dom = await JSDOM.fromURL(url);

  const items = selectAll(dom.window.document, itemSelector);

  const result: ListResult = {
    items: [],
    debug: {
      firstLink: undefined,
      firstTitle: undefined,
      itemsAfterFilter: 0,
      itemsFound: items.length,
    },
  };

  for (const item of items ?? []) {
    if (
      include &&
      include.trim() !== "" &&
      (item.textContent === null ||
        item.textContent.toLocaleLowerCase().includes(include.toLocaleLowerCase()) === false)
    ) {
      continue;
    }

    if (
      exclude &&
      exclude.trim() !== "" &&
      (item.textContent === null ||
        item.textContent.toLocaleLowerCase().includes(exclude.toLocaleLowerCase()) === true)
    ) {
      continue;
    }

    result.debug.itemsAfterFilter += 1;

    const title =
      titleSelector && titleSelector.trim() !== ""
        ? select(item, titleSelector)?.textContent
        : item.textContent;

    if (result.debug.firstTitle === undefined) {
      result.debug.firstTitle = title;
    }

    if (title && result.items.every((item) => item.title !== title)) {
      const link = linkSelector && linkSelector.trim() !== "" ? select(item, linkSelector) : item;
      const itemUrl = link?.tagName === "A" ? (link.getAttribute("href") ?? undefined) : undefined;
      const parsedUrl = itemUrl ? URL.parse(itemUrl, url)?.href : undefined;

      if (result.debug.firstLink === undefined) {
        result.debug.firstLink = parsedUrl;
      }

      result.items.push({ title, url: parsedUrl });
    }
  }

  return Response.json(result);
};

const select = (root: Document | Element, selector: string) => {
  try {
    return root.querySelector(selector);
  } catch (error) {
    console.error(error);
    return null;
  }
};

const selectAll = (root: Document | Element, selector: string) => {
  try {
    return root.querySelectorAll(selector);
  } catch (error) {
    console.error(error);
    return [];
  }
};
