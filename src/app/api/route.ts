import { JSDOM } from "jsdom";
import type { ListResult } from "..";

export const GET = async (request: Request) => {
  const requestUrl = URL.parse(request.url);

  const itemFilter = requestUrl?.searchParams.get("itemFilter");
  const itemSelector = requestUrl?.searchParams.get("itemSelector");
  const titleSelector = requestUrl?.searchParams.get("titleSelector");
  const linkSelector = requestUrl?.searchParams.get("linkSelector");
  const url = requestUrl?.searchParams.get("url");

  if (itemSelector === null || itemSelector === undefined) {
    return new Response("Missing itemSelector query param", { status: 400 });
  }

  if (url === null || url === undefined) {
    return new Response("Missing URL query param", { status: 400 });
  }

  const dom = await JSDOM.fromURL(url);

  const items = dom.window.document.querySelectorAll(itemSelector);

  const result: ListResult = {
    items: [],
    debug: {
      itemsFound: items.length,
      itemsAfterFilter: 0,
      firstTitle: undefined,
      firstLink: undefined,
    },
  };

  for (const item of items ?? []) {
    if (
      itemFilter &&
      itemFilter.trim() !== "" &&
      (item.textContent === null || item.textContent.includes(itemFilter) === false)
    ) {
      continue;
    }
    result.debug.itemsAfterFilter += 1;
    const title =
      titleSelector && titleSelector.trim() !== ""
        ? item.querySelector(titleSelector)?.textContent
        : item.textContent;
    if (result.debug.firstTitle === undefined && title) {
      result.debug.firstTitle = title;
    }
    if (title) {
      const link =
        linkSelector && linkSelector.trim() !== "" ? item.querySelector(linkSelector) : item;
      const itemUrl = link?.tagName === "A" ? (link.getAttribute("href") ?? undefined) : undefined;
      const parsedUrl = itemUrl ? URL.parse(itemUrl, url)?.href : undefined;
      if (parsedUrl === undefined) {
        continue;
      }
      if (result.debug.firstLink === undefined && parsedUrl) {
        result.debug.firstLink = parsedUrl;
      }
      if (result.items.some((r) => r.url === parsedUrl)) {
        continue;
      }
      result.items.push({ title, url: parsedUrl });
    }
  }

  return Response.json(result);
};
