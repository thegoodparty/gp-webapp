declare module 'csv-writer' {
  interface CsvHeader {
    id: string
    title: string
  }

  interface CreateObjectCsvWriterParams {
    path: string
    header: CsvHeader[]
    fieldDelimiter?: string
    recordDelimiter?: string
    headerIdDelimiter?: string
    alwaysQuote?: boolean
    encoding?: string
    append?: boolean
  }

  interface CreateArrayCsvWriterParams {
    path: string
    header?: string[]
    fieldDelimiter?: string
    recordDelimiter?: string
    alwaysQuote?: boolean
    encoding?: string
    append?: boolean
  }

  interface CreateObjectCsvStringifierParams {
    header: CsvHeader[]
    fieldDelimiter?: string
    recordDelimiter?: string
    headerIdDelimiter?: string
    alwaysQuote?: boolean
  }

  interface CreateArrayCsvStringifierParams {
    header?: string[]
    fieldDelimiter?: string
    recordDelimiter?: string
    alwaysQuote?: boolean
  }

  interface CsvWriter<T> {
    writeRecords(records: T[]): Promise<void>
  }

  interface CsvStringifier<T> {
    getHeaderString(): string | null
    stringifyRecords(records: T[]): string
  }

  export function createObjectCsvWriter(
    params: CreateObjectCsvWriterParams
  ): CsvWriter<Record<string, unknown>>

  export function createArrayCsvWriter(
    params: CreateArrayCsvWriterParams
  ): CsvWriter<unknown[]>

  export function createObjectCsvStringifier(
    params: CreateObjectCsvStringifierParams
  ): CsvStringifier<Record<string, unknown>>

  export function createArrayCsvStringifier(
    params: CreateArrayCsvStringifierParams
  ): CsvStringifier<unknown[]>
}
