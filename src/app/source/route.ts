import { after } from "next/server";
import { createClient } from "redis";
import { toTemporalInstant } from "temporal-polyfill";
import * as v from "valibot";
import { ResponseError } from "@/errors/ResponseError";
import type { SourceResponse, SourceResponseDebugInfo, SourceResponseItem } from "@/index";
import { sourceRequestSchema } from "@/schemas/sourceRequestSchema";
import { createDOM } from "@/utils/createDOM";
import { select } from "@/utils/select";
import { selectAll } from "@/utils/selectAll";

export const GET = async (request: Request) => {
  const debugInfo: SourceResponseDebugInfo = {
    htmlSamples: {
      excludeFilter: [],
      includeFilter: [],
      matched: [],
    },
    itemsMatched: 0,
    itemsRemovedByExcludeFilter: 0,
    itemsRemovedByIncludeFilter: 0,
  };

  try {
    const redis = process.env.REDIS_URL ? createClient({ url: process.env.REDIS_URL }) : null;

    if (redis) await redis.connect();

    after(() => {
      if (redis) redis.destroy();
    });

    const items: Array<SourceResponseItem> = [];

    const requestUrl = new URL(request.url);

    const params: { [key: string]: string } = {};

    for (const [key, value] of requestUrl.searchParams) {
      if (key in params) {
        throw new ResponseError(`Duplicate query params: ${key}`, 400);
      }
      params[key] = value;
    }

    const parsedParams = v.safeParse(sourceRequestSchema, params);

    if (!parsedParams.success) {
      throw new ResponseError(
        "Invalid query params",
        400,
        parsedParams.issues.map((issue) =>
          issue.path ? `${issue.path.join(".")}: ${issue.message}` : issue.message,
        ),
      );
    }

    const { debug, exclude, include, itemSelector, linkSelector, titleSelector, url } =
      parsedParams.output;

    const sourceResponse = await fetch(url, {
      next: {
        revalidate: process.env.NODE_ENV === "development" ? 60 : 3600,
      },
    });

    if (sourceResponse.ok === false) {
      throw new ResponseError("Failed to fetch from source", 502);
    }

    const sourceDateHeader = sourceResponse.headers.get("date");

    const sourceUpdatedInstant = toTemporalInstant.apply(
      sourceDateHeader ? new Date(sourceDateHeader) : new Date(Date.now()),
    );

    const html = await sourceResponse.text();

    const dom = await createDOM(html, url);

    if (!dom) {
      throw new ResponseError("Unable to parse source");
    }

    const matchedItems = selectAll(dom.window.document, itemSelector);

    debugInfo.itemsMatched = matchedItems.length;

    for (const item of matchedItems) {
      const lowercaseText = item.textContent.toLocaleLowerCase();

      if (include.length > 0 && item.textContent !== null) {
        if (include.every((phrase) => lowercaseText.includes(phrase) === false)) {
          debugInfo.itemsRemovedByIncludeFilter += 1;
          if (debugInfo.htmlSamples.includeFilter.length < 3) {
            debugInfo.htmlSamples.includeFilter.push(item.outerHTML);
          }
          continue;
        }
      }

      if (exclude.length > 0 && item.textContent !== null) {
        if (exclude.some((phrase) => lowercaseText.includes(phrase) === true)) {
          debugInfo.itemsRemovedByExcludeFilter += 1;
          if (debugInfo.htmlSamples.excludeFilter.length < 3) {
            debugInfo.htmlSamples.excludeFilter.push(item.outerHTML);
          }
          continue;
        }
      }

      if (debugInfo.htmlSamples.matched.length < 3) {
        debugInfo.htmlSamples.matched.push(item.outerHTML);
      }

      const title =
        titleSelector && titleSelector.trim() !== ""
          ? select(item, titleSelector)?.textContent
          : item.textContent;

      if (title && items.every((item) => item.title !== title)) {
        const link = linkSelector && linkSelector.trim() !== "" ? select(item, linkSelector) : item;
        const itemUrl =
          link?.tagName === "A" ? (link.getAttribute("href") ?? undefined) : undefined;
        const parsedUrl = itemUrl ? URL.parse(itemUrl, url)?.href : undefined;

        items.push({
          firstSeen: sourceUpdatedInstant.toString(),
          title,
          url: parsedUrl,
        });
      }
    }

    if (redis) {
      const keys = items.map(
        ({ title }) => `${url}:${itemSelector}:${titleSelector ?? ""}:${title.slice(0, 100)}`,
      );

      if (keys.length > 0) {
        const firstSeenValues = await redis.HMGET("first_seen", keys);

        for (let i = 0; i < firstSeenValues.length; i++) {
          const value = firstSeenValues[i];
          const item = items[i];

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

    const response: SourceResponse = {
      debug: debug ? debugInfo : undefined,
      fetchedAt: sourceUpdatedInstant.toString(),
      items,
      ok: true,
    };

    return Response.json(response, {
      headers: {
        "Vercel-CDN-Cache-Control": "max-age=10",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : `Unknown error: ${error}`;

    const response: SourceResponse = {
      debug: debugInfo,
      errors: error instanceof ResponseError ? error.errors : [message],
      ok: false,
    };

    return Response.json(response, {
      status: error instanceof ResponseError ? error.statusCode : 500,
      statusText: message,
    });
  }
};
