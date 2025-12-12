'use client'
import { getContactStats, type PeopleStats } from './shared/stats.util'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { useEffect, useState } from 'react'
import {
  LuUserRound,
  LuHouse,
  LuBaby,
  LuDollarSign,
  LuPercent,
} from 'react-icons/lu'
import { Card } from 'goodparty-styleguide'

const fetchPeopleStats = async (): Promise<PeopleStats> => {
  const response = await clientFetch<PeopleStats>(apiRoutes.contacts.stats)

  if (response.ok) {
    return response.data || {}
  }
  console.warn('Failed to fetch people stats', response)
  return {}
}

interface StatCard {
  key: string
  label: string
  value: string | null
  icon: React.JSX.Element
}

type ContactsStatsSectionProps = {
  totalVisibleContacts: number
  onlyTotalVisibleContacts: boolean
}

export default function ContactsStatsSection({
  totalVisibleContacts,
  onlyTotalVisibleContacts,
}: ContactsStatsSectionProps) {
  const [stats, setStats] = useState<PeopleStats | undefined>(undefined)

  useEffect(() => {
    fetchPeopleStats().then(setStats)
  }, [])

  const loading = stats === undefined

  const contactStats = getContactStats(stats ?? {}, totalVisibleContacts)

  const renderCard = (card: StatCard, loading: boolean) => {
    return (
      <Card className="p-0">
        <div className="flex flex-col p-3">
          <div className="flex items-center gap-4 justify-between">
            <label
              className="font-medium text-sm truncate min-w-0 flex-1"
              title={card.label}
            >
              {card.label}
            </label>
            <div className="text-sm flex-shrink-0">{card.icon}</div>
          </div>
          {loading ? (
            <div className="h-8 bg-gray-100 rounded animate-pulse mt-1 w-full"></div>
          ) : (
            <h4 className="font-bold text-2xl mt-1">{card.value}</h4>
          )}
        </div>
      </Card>
    )
  }

  return (
    <section className="mt-4 mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 ">
      {renderCard(
        {
          key: 'totalConstituents',
          label: 'Total Constituents',
          value: contactStats.totalConstituents,
          icon: <LuUserRound />,
        },
        loading,
      )}
      {onlyTotalVisibleContacts && (
        <div className="hidden md:block">
          {renderCard(
            {
              key: 'visibleContactsPercent',
              label: '% of Constituents',
              value: contactStats.visibleContactsPercent,
              icon: <LuPercent />,
            },
            loading,
          )}
        </div>
      )}
      {!onlyTotalVisibleContacts && (
        <div className="hidden md:block">
          {renderCard(
            {
              key: 'homeowners',
              label: 'Homeowners',
              value: contactStats.homeownersPercent,
              icon: <LuHouse />,
            },
            loading,
          )}
        </div>
      )}
      {!onlyTotalVisibleContacts && (
        <div className="hidden md:block">
          {renderCard(
            {
              key: 'hasChildren',
              label: 'Has Children Under 18',
              value: contactStats.hasChildrenUnder18Percent,
              icon: <LuBaby />,
            },
            loading,
          )}
        </div>
      )}
      {!onlyTotalVisibleContacts && (
        <div className="hidden md:block">
          {renderCard(
            {
              key: 'medianIncome',
              label: 'Median Income Range',
              value: contactStats.medianIncomeRange,
              icon: <LuDollarSign />,
            },
            loading,
          )}
        </div>
      )}
    </section>
  )
}
