'use client'
import React, { useEffect } from 'react'
import styles from './AshbyCareers.module.scss'
import Link from 'next/link'
import H2 from '@shared/typography/H2'

interface Job {
  id: string
  title: string
  departmentName: string
  locationName: string
  employmentType: string
}

interface AshbyCareersProps {
  jobs: Job[]
}

const AshbyCareers = ({ jobs }: AshbyCareersProps): React.JSX.Element => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const queryParams = new URLSearchParams(window.location.search)
      const jid = queryParams.get('ashby_jid')

      if (jid) {
        window.location.href = `/work-with-us/${jid}`
      }
    }
  }, [])

  return (
    <section className={styles.wrapper}>
      <H2 data-cy="opening-title">Current Openings</H2>

      {jobs && jobs.length > 0 && (
        <div className="grid grid-cols-12 gap-4">
          {jobs.map((job) => (
            <div
              className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3"
              key={job.id}
            >
              <Link href={`/work-with-us/${job.id}`}>
                <div className="flex flex-col h-full bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-violet-600">
                    {job.title}
                  </h3>
                  <p className="text-sm">
                    {job.departmentName} • {job.locationName} •{' '}
                    {job.employmentType}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default AshbyCareers

