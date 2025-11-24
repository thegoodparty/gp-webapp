export {}

declare global {
  export namespace PrismaJson {
    export type CountyData = {
      county_full?: string
      city_largest?: string
      population?: string
      density?: string
      income_household_median?: string
      unemployment_rate?: string
      home_value?: string
      county?: string
      city?: string
      state_id?: string
      county_name?: string
      township?: string
      incorporated?: string
    }
  }
}
