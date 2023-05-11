import { load } from "js-yaml";

import { JsonObject } from "./types";

export function yamlToJson(str: string): JsonObject {
    return load(str, {
        json: false
    }) as JsonObject;
}
