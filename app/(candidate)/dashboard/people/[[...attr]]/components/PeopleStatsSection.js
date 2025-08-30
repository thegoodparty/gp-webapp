import { numberFormatter } from 'helpers/numberHelper'
import { LuVote } from 'react-icons/lu'
import { SlPeople } from 'react-icons/sl'
import Paper from '@shared/utils/Paper'
import Body1 from '@shared/typography/Body1'

const fetchPeopleStats = async () => {
  return {
    total: 15875,
    largestAgeGroup: '35-50',
    largestAgeGroupPercentage: 42,
    largestCommunity: 'District 1',
    politicalMakeup: {
      republican: 42,
      democrat: 38,
      independent: 20,
    },
  }
}

export default async function PeopleStatsSection() {
  const peopleStats = await fetchPeopleStats()

  const cards = [
    {
      key: 'total',
      label: 'Total Constituents',
      value: peopleStats.total ? numberFormatter(peopleStats.total) : 'N/A',
      icon: (
        <div className="text-2xl text-slate-600 bg-slate-100 rounded flex items-center justify-center h-10 w-10">
          <SlPeople />
        </div>
      ),
    },
    {
      key: 'politicalMakeup',
      label: 'Political Makeup',
      value: peopleStats.politicalMakeup
        ? `${peopleStats.politicalMakeup.republican}% Republicans`
        : 'N/A',
      icon: (
        <div className="text-2xl text-purple-600 bg-purple-100 rounded flex items-center justify-center h-10 w-10">
          <LuVote />
        </div>
      ),
    },
    {
      key: 'largestCommunity',
      label: 'Largest Community',
      value: peopleStats.largestCommunity
        ? `${peopleStats.largestCommunity}`
        : 'N/A',
      icon: (
        <div className="text-2xl text-blue-600 bg-blue-100 rounded flex items-center justify-center h-10 w-10">
          <SlPeople />
        </div>
      ),
    },
    {
      key: 'largestAgeGroup',
      label: 'Largest Age Group',
      value: peopleStats.largestAgeGroup
        ? `${peopleStats.largestAgeGroupPercentage}% are ${peopleStats.largestAgeGroup} years old`
        : 'N/A',
      icon: (
        <div className="text-2xl text-blue-600 bg-blue-100 rounded flex items-center justify-center h-10 w-10">
          <SlPeople />
        </div>
      ),
    },
  ]

  return (
    <section className="mt-4 mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 ">
      {cards.map((card) => (
        <Paper key={card.key}>
          <div className="flex items-center gap-4">
            <div>{card.icon}</div>
            <div className="flex flex-col">
              <Body1 className="text-slate-500">{card.label}</Body1>
              <Body1 className="font-semibold">{card.value}</Body1>
            </div>
          </div>
        </Paper>
      ))}
    </section>
  )
}
