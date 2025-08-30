import { JSDOM, VirtualConsole } from "jsdom";
import { after } from "next/server";
import { createClient } from "redis";
import { toTemporalInstant } from "temporal-polyfill";
import type { ListResult } from "..";

export const GET = async (request: Request) => {
  const redis = process.env.REDIS_URL ? createClient({ url: process.env.REDIS_URL }) : null;

  if (redis) await redis.connect();

  after(() => {
    if (redis) redis.destroy();
  });

  const requestUrl = URL.parse(request.url);

  const include = requestUrl?.searchParams.get("include");
  const exclude = requestUrl?.searchParams.get("exclude");
  const itemSelector = requestUrl?.searchParams.get("itemSelector");
  const titleSelector = requestUrl?.searchParams.get("titleSelector");
  const linkSelector = requestUrl?.searchParams.get("linkSelector");
  const url = requestUrl?.searchParams.get("url");

  if (url === null || url === undefined) {
    return new Response(null, { status: 400, statusText: "Missing URL query param" });
  }

  if (itemSelector === null || itemSelector === undefined || itemSelector.trim() === "") {
    return new Response(null, { status: 400, statusText: "Missing itemSelector query param" });
  }

  const response = await fetch(url, {
    next: {
      revalidate: process.env.NODE_ENV === "development" ? 60 : 3600,
    },
  });

  if (response.ok === false) throw Error("Failed to fetch URL");

  const sourceDateHeader = response.headers.get("date");

  const sourceUpdatedInstant = toTemporalInstant.apply(
    sourceDateHeader ? new Date(sourceDateHeader) : new Date(Date.now()),
  );

  const html = await response.text();

  const dom = await createDOM(html, url);

  if (!dom) {
    return new Response(null, { status: 500, statusText: "Unable to load URL" });
  }

  const items = selectAll(dom.window.document, itemSelector);

  const result: ListResult = {
    debug: {
      firstLink: undefined,
      firstTitle: undefined,
      itemsAfterFilter: 0,
      itemsFound: items.length,
    },
    fetchedAt: sourceUpdatedInstant.toString(),
    items: [],
  };

  for (const item of items ?? []) {
    if (include && include.trim() !== "" && item.textContent !== null) {
      const words = include.split(",").map((word) => word.trim().toLocaleLowerCase());
      if (words.every((word) => item.textContent.toLocaleLowerCase().includes(word) === false)) {
        continue;
      }
    }

    if (exclude && exclude.trim() !== "" && item.textContent !== null) {
      const words = exclude.split(",").map((word) => word.trim().toLocaleLowerCase());
      if (words.some((word) => item.textContent.toLocaleLowerCase().includes(word) === true)) {
        continue;
      }
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

      result.items.push({
        firstSeen: sourceUpdatedInstant.toString(),
        title,
        url: parsedUrl,
      });
    }
  }

  if (redis) {
    const keys = result.items.map(
      ({ title }) => `${url}:${itemSelector}:${titleSelector ?? ""}:${title.slice(0, 100)}`,
    );

    if (keys.length > 0) {
      const firstSeenValues = await redis.HMGET("first_seen", keys);

      for (let i = 0; i < firstSeenValues.length; i++) {
        const value = firstSeenValues[i];
        const item = result.items[i];

        if (item && value) item.firstSeen = value;
      }

      await redis
        .multi()
        .HSET(
          "first_seen",
          Object.fromEntries(
            keys.map((key, index) => [
              key,
              firstSeenValues[index] ?? sourceUpdatedInstant.toString(),
            ]),
          ),
        )
        .HEXPIRE("first_seen", keys, 60 * 60 * 24 * 28)
        .exec();
    }
  }

  return Response.json(result, {
    headers: {
      "Vercel-CDN-Cache-Control": "max-age=30",
    },
  });
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

const createDOM = async (html: string, url: string) => {
  const virtualConsole = new VirtualConsole();
  try {
    const dom = new JSDOM(html, { url, virtualConsole });
    return dom;
  } catch (error) {
    console.error(error);
    return null;
  }
};
