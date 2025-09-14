import type { InferOutput } from "valibot";
import type { sourceConfigSchema } from "./schemas/sourceConfigSchema";
import type { sourceRequestSchema } from "./schemas/sourceRequestSchema";

export type SourceConfig = InferOutput<typeof sourceConfigSchema>;

export type SourceRequest = InferOutput<typeof sourceRequestSchema>;

export type SourceResponse =
  | {
      debug?: SourceResponseDebugInfo;
      fetchedAt: string;
      items: Array<SourceResponseItem>;
      ok: true;
    }
  | {
      debug: SourceResponseDebugInfo;
      errors: Array<string>;
      ok: false;
    };

export type SourceResponseDebugInfo = {
  htmlSamples: {
    excludeFilter: Array<string>;
    includeFilter: Array<string>;
    matched: Array<string>;
  };
  itemsMatched: number;
  itemsRemovedByExcludeFilter: number;
  itemsRemovedByIncludeFilter: number;
};

export type SourceResponseItem = {
  firstSeen: string;
  title: string;
  url: string | undefined;
};
