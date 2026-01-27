import { orderBy } from 'es-toolkit'
import { useState } from 'react'
import { MAX_CONSTITUENTS_PER_RUN, PRICE_PER_POLL_TEXT } from './constants'
import { formatCurrency, numberFormatter } from 'helpers/numberHelper'
import clsx from 'clsx'
import { useQuery } from '@tanstack/react-query'
import { districtStatsQueryOptions } from './queries'

export const useTotalConstituentsWithCellPhone = () =>
  useQuery({
    ...districtStatsQueryOptions(),
    select: (data) => ({
      totalConstituents: data.totalConstituentsWithCellPhone,
    }),
  })

const calculateRecommendedPollSize = (params: {
  expectedResponseRate: number
  totalConstituentsWithCellPhone: number
  alreadySent: number
  responsesAlreadyReceived: number
}) => {
  const totalRemainingUsableConstituents = Math.min(
    MAX_CONSTITUENTS_PER_RUN,
    params.totalConstituentsWithCellPhone - params.alreadySent,
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
    totalRemainingUsableConstituents,
  }
}

export type PollAudienceSelection = {
  /** The selected number of constituents. */
  count: number
  /** Whether the selected number of constituents was the recommended number. */
  isRecommended: boolean

  /** The 1-based index of the selected option. */
  optionIndex: number
}

export const PollAudienceSelector: React.FC<{
  expectedResponseRate: number
  totalConstituentsWithCellPhone: number
  alreadySent: number
  responsesAlreadyReceived: number
  onSelect: (selected: PollAudienceSelection) => void
  showRecommended: boolean
}> = ({
  expectedResponseRate,
  totalConstituentsWithCellPhone,
  alreadySent,
  responsesAlreadyReceived,
  onSelect,
  showRecommended,
}) => {
  const [selectedAudienceSize, setSelectedAudienceSize] = useState<
    number | undefined
  >(undefined)

  const isTotalConstituentsCapped =
    totalConstituentsWithCellPhone > MAX_CONSTITUENTS_PER_RUN

  const { recommendedSendCount, totalRemainingUsableConstituents } =
    calculateRecommendedPollSize({
      alreadySent,
      expectedResponseRate,
      responsesAlreadyReceived,
      totalConstituentsWithCellPhone,
    })

  const recommendedMessage =
    'The smallest group for statistically reliable results.'

  let options = [
    { pct: 0.25, message: 'Low impact.' },
    { pct: 0.5, message: 'Medium impact.' },
    { pct: 0.75, message: 'High impact.' },
    { pct: 1, message: "You can't do any better than this!" },
  ].map(({ pct, message }) => {
    const count = Math.ceil(totalRemainingUsableConstituents * pct)
    const isRecommended = count === recommendedSendCount
    return {
      count,
      percentage: `${pct * 100}%`,
      isRecommended: count === recommendedSendCount,
      message: isRecommended ? recommendedMessage : message,
    }
  })

  // cap options at MAX_CONSTITUENTS_PER_RUN
  let hasCapped = false
  options = options
    .map((option) => {
      const count = Math.min(option.count, MAX_CONSTITUENTS_PER_RUN)
      if (hasCapped) {
        return null
      }
      if (count !== option.count) {
        hasCapped = true
      }
      const percentage = Math.round(
        (count / totalRemainingUsableConstituents) * 100,
      )
      return {
        ...option,
        count,
        percentage: percentage < 1 ? '<1%' : `${percentage}%`,
      }
    })
    .filter((option) => option !== null)

  if (showRecommended && !options.some((option) => option.isRecommended)) {
    const recommendedPercentage = Math.round(
      (recommendedSendCount / totalRemainingUsableConstituents) * 100,
    )
    options = orderBy(
      [
        ...options,
        {
          count: recommendedSendCount,
          percentage:
            recommendedPercentage < 1 ? '<1%' : `${recommendedPercentage}%`,
          isRecommended: true,
          message: recommendedMessage,
        },
      ],
      [(o) => o.count],
      ['asc'],
    )
  }

  return (
    <div>
      <div className="w-full flex flex-col gap-2">
        {options.map((option, idx) => (
          <div
            key={`audience-option-${option.count}`}
            className={clsx(
              // hover
              'flex items-center justify-between flex-row border-2 rounded-lg p-4 gap-4 hover:border-blue-400 cursor-pointer',
              // thicker blue border when selected
              selectedAudienceSize === option.count
                ? 'border-blue-500'
                : 'border-slate-200',
            )}
            onClick={() => {
              setSelectedAudienceSize(option.count)
              onSelect({
                count: option.count,
                isRecommended: option.isRecommended,
                optionIndex: idx + 1,
              })
            }}
          >
            <div className="flex-1">
              <p>
                {numberFormatter(option.count)} constituents (
                {option.percentage})
              </p>
              <p className="text-sm text-muted-foreground">{option.message}</p>
            </div>
            {showRecommended && option.isRecommended && (
              <span className="ml-8 inline-flex items-center px-2 py-0.5 rounded bg-blue-500 text-white">
                Recommended
              </span>
            )}
            <p>${formatCurrency(PRICE_PER_POLL_TEXT * option.count)}</p>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <p className="text-sm text-muted-foreground text-center">
          Each message costs ${PRICE_PER_POLL_TEXT}.
        </p>

        {isTotalConstituentsCapped && (
          <p className="text-sm text-muted-foreground text-center">
            You can only send to {numberFormatter(MAX_CONSTITUENTS_PER_RUN)}{' '}
            constituents at a time.
          </p>
        )}
        <p className="text-sm text-muted-foreground text-center">
          Once your poll results are in, you can expand your poll to send to
          more people.
        </p>
      </div>
    </div>
  )
}
