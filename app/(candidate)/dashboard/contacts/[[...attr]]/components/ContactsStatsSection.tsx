'use client'
import {
  ContactStatsRendered,
  getContactStatsRendered,
} from './shared/stats.util'
import {
  LuUserRound,
  LuHouse,
  LuBaby,
  LuDollarSign,
  LuPercent,
} from 'react-icons/lu'
import { Card } from 'goodparty-styleguide'
import { districtStatsQueryOptions } from 'app/(candidate)/dashboard/polls/shared/queries'
import { useQuery } from '@tanstack/react-query'

interface StatCard {
  key: string
  label: string
  getValue: (stats: ContactStatsRendered) => string | null
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
  const query = useQuery(districtStatsQueryOptions())

  const renderCard = (card: StatCard) => {
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
          {query.status !== 'success' ? (
            <div className="h-8 bg-gray-100 rounded animate-pulse mt-1 w-full"></div>
          ) : (
            <h4 className="font-bold text-2xl mt-1">
              {card.getValue(
                getContactStatsRendered(query.data, totalVisibleContacts),
              )}
            </h4>
          )}
        </div>
      </Card>
    )
  }

  return (
    <section className="mt-4 mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 ">
      {renderCard({
        key: 'totalConstituents',
        label: 'Total Constituents',
        getValue: (stats) => stats.totalVisibleContacts,
        icon: <LuUserRound />,
      })}
      {onlyTotalVisibleContacts && (
        <div className="hidden md:block">
          {renderCard({
            key: 'visibleContactsPercent',
            label: '% of Constituents',
            getValue: (stats) => stats.visibleContactsPercent,
            icon: <LuPercent />,
          })}
        </div>
      )}
      {!onlyTotalVisibleContacts && (
        <div className="hidden md:block">
          {renderCard({
            key: 'homeowners',
            label: 'Homeowners',
            getValue: (stats) => stats.homeownersPercent,
            icon: <LuHouse />,
          })}
        </div>
      )}
      {!onlyTotalVisibleContacts && (
        <div className="hidden md:block">
          {renderCard({
            key: 'hasChildren',
            label: 'Has Children Under 18',
            getValue: (stats) => stats.hasChildrenUnder18Percent,
            icon: <LuBaby />,
          })}
        </div>
      )}
      {!onlyTotalVisibleContacts && (
        <div className="hidden md:block">
          {renderCard({
            key: 'medianIncome',
            label: 'Median Income Range',
            getValue: (stats) => stats.medianIncomeRange,
            icon: <LuDollarSign />,
          })}
        </div>
      )}
    </section>
  )
}
