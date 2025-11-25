export const calculateRecommendedPollSize = (params: {
  expectedResponseRate: number
  totalConstituents: number
  alreadySent: number
  responsesAlreadyReceived: number
}) => {
  const totalRemainingConstituents =
    params.totalConstituents - params.alreadySent

  // originally designed here: https://goodparty.clickup.com/t/90132012119/ENG-4825
  let recommendedSendCount =
    (83 - params.responsesAlreadyReceived) / params.expectedResponseRate

  if (recommendedSendCount > totalRemainingConstituents) {
    recommendedSendCount = totalRemainingConstituents
  }
  recommendedSendCount = Math.ceil(recommendedSendCount)

  return { recommendedSendCount, totalRemainingConstituents }
}
