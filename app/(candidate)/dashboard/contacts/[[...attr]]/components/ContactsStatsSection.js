'use client'
import Paper from '@shared/utils/Paper'
import Body2 from '@shared/typography/Body2'
import { generateCards } from './shared/stats.util'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { useEffect, useState } from 'react'
import React from 'react'

const fetchPeopleStats = async () => {
  const response = await clientFetch(apiRoutes.contacts.stats)

  if (response.ok) {
    return response.data || {}
  }
  console.warn('Failed to fetch people stats', response)
  return {}
}

export default function ContactsStatsSection() {
  const [stats, setStats] = useState(undefined)

  useEffect(() => {
    fetchPeopleStats().then(setStats)
  }, [])

  const cards = generateCards(stats ?? {})

  return (
    <section className="mt-4 mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 ">
      {stats === undefined
        ? // Show loading skeleton with 4 cards
          Array.from({ length: 4 }, (_, index) => (
            <Paper key={`loading-${index}`}>
              <div className="flex items-center gap-4 justify-between">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded animate-pulse mt-1 w-16"></div>
            </Paper>
          ))
        : // Show actual data cards
          cards.map((card) => (
            <Paper key={card.key}>
              <div className="flex items-center gap-4 justify-between">
                <Body2 className="font-medium">{card.label}</Body2>
                <div>{card.icon}</div>
              </div>

              <h4 className="font-bold mt-1 text-2xl" data-testid={`${card.key}-value`}>{card.value}</h4>
            </Paper>
          ))}
    </section>
  )
}
