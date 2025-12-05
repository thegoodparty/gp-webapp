import { MAX_CONSTITUENTS_PER_RUN } from './constants'

export const calculateRecommendedPollSize = (params: {
  expectedResponseRate: number
  totalConstituents: number
  alreadySent: number
  responsesAlreadyReceived: number
}) => {
  const usableTotalConstituents = Math.min(
    params.totalConstituents,
    MAX_CONSTITUENTS_PER_RUN,
  )

  const totalRemainingConstituents =
    params.totalConstituents - params.alreadySent

  const totalRemainingUsableConstituents = Math.min(
    usableTotalConstituents,
    totalRemainingConstituents,
  )
  // originally designed here: https://goodparty.clickup.com/t/90132012119/ENG-4825
  let recommendedSendCount =
    (83 - params.responsesAlreadyReceived) / params.expectedResponseRate

  // cap the total remaining constituents at the usable total constituents
  // so that we don't recommend sending to more constituents than we can
  if (recommendedSendCount > totalRemainingUsableConstituents) {
    recommendedSendCount = totalRemainingUsableConstituents
  }
  recommendedSendCount = Math.ceil(recommendedSendCount)

  return {
    recommendedSendCount,
    totalRemainingConstituents,
  }
}
