export {}

declare global {
  export namespace PrismaJson {
    export type CampaignPlanVersionData = Record<
      string,
      { date: string; text: string }[]
    >
  }
}
