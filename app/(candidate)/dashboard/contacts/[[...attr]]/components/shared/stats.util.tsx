import { numberFormatter } from 'helpers/numberHelper'
import { BiMaleFemale } from 'react-icons/bi'
import { FaPersonCane } from 'react-icons/fa6'
import { LuDollarSign, LuVote } from 'react-icons/lu'
import { MdOutlinePeopleAlt } from 'react-icons/md'
import { SlPeople } from 'react-icons/sl'

const MAX_CARDS = 4

interface Bucket {
  label: string
  count: number
  percent: number
}

interface Category {
  buckets: Bucket[]
}

interface PeopleStats {
  meta?: {
    totalConstituents?: number
  }
  categories?: {
    partiesDescription?: Category
    ethnicGroupsEthnicGroup1Desc?: Category
    age?: Category
    gender?: Category
    estimatedIncomeRange?: Category
  }
}

interface StatCard {
  key: string
  label: string
  value: string
  icon: React.JSX.Element
}

const hasKnownData = (category: Category | undefined): boolean => {
  if (!category || !category.buckets) return false
  const totalCount = category.buckets.reduce(
    (sum, bucket) => sum + bucket.count,
    0,
  )
  const unknownCount = category.buckets
    .filter((b) => b.label === 'Unknown')
    .reduce((sum, bucket) => sum + bucket.count, 0)
  return totalCount > 0 && unknownCount < totalCount
}

const getTopItem = (category: Category | undefined): Bucket | null => {
  if (!category || !category.buckets) return null
  const sorted = [...category.buckets]
    .filter((b) => b.label !== 'Unknown')
    .sort((a, b) => b.count - a.count)
  return sorted[0] || null
}

/**
 * Generates stat cards from people stats data
 * @param peopleStats - The aggregated statistics object
 * @returns Array of card objects with key, label, value, and icon
 */
export const generateCards = (peopleStats: PeopleStats): StatCard[] => {
  const allCards: StatCard[] = []

  if (peopleStats?.meta?.totalConstituents) {
    allCards.push({
      key: 'totalConstituents',
      label: 'Total Constituents',
      value: numberFormatter(peopleStats.meta.totalConstituents),
      icon: (
        <div className="text-lg text-slate-600">
          <SlPeople />
        </div>
      ),
    })
  }

  if (hasKnownData(peopleStats?.categories?.partiesDescription)) {
    const topParty = getTopItem(peopleStats.categories?.partiesDescription)
    if (topParty) {
      allCards.push({
        key: 'politicalMakeup',
        label: 'Political Makeup',
        value: `${Math.round(topParty.percent * 100)}% ${topParty.label}`,
        icon: (
          <div className="text-lg text-slate-600">
            <LuVote />
          </div>
        ),
      })
    }
  }

  if (hasKnownData(peopleStats?.categories?.ethnicGroupsEthnicGroup1Desc)) {
    const topEthnic = getTopItem(
      peopleStats.categories?.ethnicGroupsEthnicGroup1Desc,
    )
    if (topEthnic) {
      allCards.push({
        key: 'ethnicGroup',
        label: 'Largest Ethnic Group',
        value: `${Math.round(topEthnic.percent * 100)}% ${topEthnic.label}`,
        icon: (
          <div className="text-lg text-slate-600">
            <MdOutlinePeopleAlt />
          </div>
        ),
      })
    }
  }

  if (hasKnownData(peopleStats?.categories?.age)) {
    const topAge = getTopItem(peopleStats.categories?.age)
    if (topAge) {
      const label = topAge.label === '51-200' ? '50+' : topAge.label
      allCards.push({
        key: 'age',
        label: 'Largest Age Group',
        value: `${Math.round(topAge.percent * 100)}% Ages ${label}`,
        icon: (
          <div className="text-lg text-slate-600">
            <FaPersonCane />
          </div>
        ),
      })
    }
  }

  if (hasKnownData(peopleStats?.categories?.gender)) {
    const topGender = getTopItem(peopleStats.categories?.gender)
    if (topGender) {
      allCards.push({
        key: 'gender',
        label: 'Gender Distribution',
        value: `${Math.round(topGender.percent * 100)}% ${topGender.label}`,
        icon: (
          <div className="text-lg text-slate-600">
            <BiMaleFemale />
          </div>
        ),
      })
    }
  }

  if (hasKnownData(peopleStats?.categories?.estimatedIncomeRange)) {
    const topIncome = getTopItem(peopleStats.categories?.estimatedIncomeRange)
    if (topIncome) {
      allCards.push({
        key: 'income',
        label: 'Most Common Income',
        value: `$${topIncome.label}`,
        icon: (
          <div className="text-lg text-slate-600">
            <LuDollarSign />
          </div>
        ),
      })
    }
  }

  const cards = allCards.slice(0, MAX_CARDS)
  return cards
}
