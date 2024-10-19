export type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JSONValue }
  | JSONValue[]

export type StreamError = {
  error: string
  data: never
  end: never
}

export type StreamSuccess<T extends JSONValue> = {
  data: T
  error: never
  end: never
}

export type StreamEnd = {
  end: string
  data: never
  error: never
}

export type StreamResult<T extends JSONValue> =
  | StreamSuccess<T>
  | StreamError
  | StreamEnd

export const MODULE_KINDS = ['', 'ln', 'mint'] as const
export type ModuleKind = (typeof MODULE_KINDS)[number]
