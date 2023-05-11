export type JsonObject = {
    [key: string]: JsonValue;
};

type JsonArray = Array<JsonValue>;

type JsonValue = string | number | JsonObject | JsonArray | null;
