'use client'

import Body1 from '@shared/typography/Body1'
import {
  Card,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'goodparty-styleguide'
import { numberFormatter } from 'helpers/numberHelper'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { useEffect, useState } from 'react'
import Body2 from '@shared/typography/Body2'
import { PRICE_PER_POLL_TEXT } from '../../../shared/constants'
import { usePoll } from '../../../shared/hooks/PollProvider'
import { LuLoaderCircle } from 'react-icons/lu'

const Content = ({ children }) => (
  <section className="mt-8 flex flex-col gap-4 md:gap-6 items-center">
    <Card className="w-full p-4 md:p-6">
      <div>{children}</div>
    </Card>
  </section>
)

const fetchContactsStats = async () => {
  const response = await clientFetch(
    apiRoutes.contacts.stats,
    { hasCellPhone: 'true' },
    {
      revalidate: 3600,
    },
  )
  return response.data
}

const calculateRecommendedIncrease = (poll, contactsStats) => {
  const totalRemainingConstituents =
    (contactsStats?.meta?.totalConstituents || 0) - poll.audienceSize

  const existingResponseRate = poll.responseCount / poll.audienceSize

  // originally designed here: https://goodparty.clickup.com/t/90132012119/ENG-4825
  let recommendedIncrease = (83 - poll.responseCount) / existingResponseRate

  if (recommendedIncrease > totalRemainingConstituents) {
    recommendedIncrease = totalRemainingConstituents
  }
  recommendedIncrease = Math.ceil(recommendedIncrease)

  return { recommendedIncrease, totalRemainingConstituents }
}

export default function SelectSection({ countCallback }) {
  const [poll] = usePoll()
  const [contactsStats, setContactsStats] = useState(null)
  const [selectedOption, setSelectedOption] = useState('')

  const handleSelect = (value) => {
    setSelectedOption(value)
    countCallback({
      count: value,
      isRecommended: recommendedIncrease === parseInt(value),
    })
  }

  useEffect(() => {
    fetchContactsStats().then((stats) => {
      setContactsStats(stats)
      handleSelect(
        calculateRecommendedIncrease(poll, stats).recommendedIncrease,
      )
    })
  }, [])

  const { recommendedIncrease, totalRemainingConstituents } =
    calculateRecommendedIncrease(poll, contactsStats)

  const selectOptions = [
    {
      label: `${numberFormatter(
        totalRemainingConstituents * 0.25,
      )} Constituents (25%)`,
      value: Math.ceil(totalRemainingConstituents * 0.25),
      isRecommended: false,
    },
    {
      label: `${numberFormatter(
        totalRemainingConstituents * 0.5,
      )} Constituents (50%)`,
      value: Math.ceil(totalRemainingConstituents * 0.5),
      isRecommended: false,
    },
    {
      label: `${numberFormatter(
        totalRemainingConstituents * 0.75,
      )} Constituents (75%)`,
      value: Math.ceil(totalRemainingConstituents * 0.75),
      isRecommended: false,
    },
    {
      label: `${numberFormatter(
        totalRemainingConstituents,
      )} Constituents (100%)`,
      value: totalRemainingConstituents,
      isRecommended: false,
    },
  ]

  const recommendedOption = selectOptions.find(
    (option) => option.value === recommendedIncrease,
  )

  if (recommendedOption) {
    recommendedOption.isRecommended = true
  } else {
    selectOptions.unshift({
      label: `${numberFormatter(
        recommendedIncrease,
      )} Constituents (${Math.round(
        (recommendedIncrease / totalRemainingConstituents) * 100,
      )}%)`,
      value: recommendedIncrease,
      isRecommended: true,
    })
  }

  if (!contactsStats) {
    return (
      <Content>
        <LuLoaderCircle
          className="animate-spin text-blue-500 mx-auto"
          size={60}
        />
      </Content>
    )
  }

  return (
    <Content>
      <Body1 className="font-semibold">Make your selection</Body1>

      <Body2 className="text-muted-foreground mb-4">
        You can text up to {numberFormatter(totalRemainingConstituents)} more
        constituents
      </Body2>
      <Select value={selectedOption} onValueChange={handleSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Recommendation for higher confidence" />
        </SelectTrigger>
        <SelectContent>
          {selectOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
              {option.isRecommended && (
                <span className="ml-8 inline-flex items-center px-2 py-0.5 rounded bg-blue-500 text-white text-xs font-medium">
                  Recommended
                </span>
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Body1 className="mt-4  ">
        {numberFormatter(selectedOption)} Constituents
      </Body1>
      <Body1>
        Cost: ${numberFormatter(PRICE_PER_POLL_TEXT * selectedOption, 2)}
      </Body1>
    </Content>
  )
}
