// Generic JSON type utilities to avoid banned types and model API payloads safely

export type JsonPrimitive = string | number | boolean | null

export type JsonValue =
  | JsonPrimitive
  | { [key: string]: JsonValue }
  | JsonValue[]

export type JsonObject = { [key: string]: JsonValue }
