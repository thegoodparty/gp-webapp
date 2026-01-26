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

  export function createObjectCsvWriter<T extends object = Partial<Record<string, string | number | boolean | null>>>(
    params: CreateObjectCsvWriterParams
  ): CsvWriter<T>

  export function createArrayCsvWriter<T extends Array<string | number | boolean | null> = Array<string | number | boolean | null>>(
    params: CreateArrayCsvWriterParams
  ): CsvWriter<T>

  export function createObjectCsvStringifier<T extends object = Partial<Record<string, string | number | boolean | null>>>(
    params: CreateObjectCsvStringifierParams
  ): CsvStringifier<T>

  export function createArrayCsvStringifier<T extends Array<string | number | boolean | null> = Array<string | number | boolean | null>>(
    params: CreateArrayCsvStringifierParams
  ): CsvStringifier<T>
}
