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
import { LuAward, LuPercent } from 'react-icons/lu'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { useEffect, useState } from 'react'
import Body2 from '@shared/typography/Body2'
import { PRICE_PER_MESSAGE } from '../../../shared/constants'

const fetchContactsStats = async () => {
  const response = await clientFetch(apiRoutes.contacts.stats, null, {
    next: {
      revalidate: 3600,
    },
  })
  return response.data
}

export default function SelectSection({ countCallback, recommended }) {
  const [contactsStats, setContactsStats] = useState(null)
  const [selectedOption, setSelectedOption] = useState(recommended)
  const handleSelect = (value) => {
    setSelectedOption(value)
    countCallback(value)
  }
  useEffect(() => {
    fetchContactsStats().then(setContactsStats)
  }, [])
  const totalConstituents = contactsStats?.meta?.totalConstituents || 0

  const selectOptions = [
    {
      label: `Recommended: ${numberFormatter(recommended)} Constituents`,
      value: recommended,
    },
    {
      label: '25%',
      value: totalConstituents * 0.25,
    },
    {
      label: '50%',
      value: totalConstituents * 0.5,
    },
    {
      label: '75%',
      value: totalConstituents * 0.75,
    },
  ]

  return (
    <section className="mt-8 flex flex-col gap-4 md:gap-6 items-center">
      <Card className="w-full bg-blue-50 p-4 md:p-6">
        <div>
          <div className="flex items-center gap-2 text-lg mb-4">
            <LuAward />
            <Body1 className="font-semibold">
              Recommendation for higher confidence
            </Body1>
          </div>
          <Body1>{numberFormatter(recommended)} Constituents</Body1>
          <Body1>
            Cost: ${numberFormatter(PRICE_PER_MESSAGE * recommended, 2)}
          </Body1>
        </div>
      </Card>
      <Card className="w-full p-4 md:p-6">
        <div>
          <div className="flex items-center gap-2 text-lg mb-4">
            <LuPercent />
            <Body1 className="font-semibold">Portion of constituent list</Body1>
          </div>
          <Body2 className="text-muted-foreground mb-4">
            You can text up to {numberFormatter(totalConstituents)} constituents
          </Body2>
          <Select value={selectedOption} onValueChange={handleSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {selectOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Body1 className="mt-4  ">
            {numberFormatter(selectedOption)} Constituents
          </Body1>
          <Body1>
            Cost: ${numberFormatter(PRICE_PER_MESSAGE * selectedOption, 2)}
          </Body1>
        </div>
      </Card>
    </section>
  )
}
