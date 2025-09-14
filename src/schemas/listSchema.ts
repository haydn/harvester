import * as v from "valibot";
import { sourceConfigSchema } from "./sourceConfigSchema";

export const listSchema = v.array(sourceConfigSchema);
