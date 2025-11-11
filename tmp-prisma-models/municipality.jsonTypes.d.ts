export {}

declare global {
  export namespace PrismaJson {
    export type MunicipalityData = {
      population?: string
      density?: string
      income_household_median?: string
      unemployment_rate?: string
      home_value?: string
      county_name?: string
      city?: string
    }
  }
}
