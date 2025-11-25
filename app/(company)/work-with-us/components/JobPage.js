'use client'
import React, { useEffect, useState } from 'react'
import Tabs from '@shared/utils/Tabs'
import H3 from '@shared/typography/H3'
import MaxWidth from '@shared/layouts/MaxWidth'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import { ArrowBackIos } from '@mui/icons-material'
import Link from 'next/link'
import DOMPurify from 'isomorphic-dompurify'

const TABS_ENUM = {
  overview: 0,
  application: 1,
}

function JobPage({ job }) {
  const [jobId, setJobId] = useState(null)
  const [tab, setTab] = useState(0)

  const labels = [
    <div
      key="overview"
      className="flex flex-col lg:flex-row items-center"
      id="overview-tab"
    >
      <div className="ml-2 font-medium text-xs lg:text-base">Overview</div>
    </div>,
    <div
      key="application"
      className="flex flex-col lg:flex-row items-center"
      id="application-tab"
    >
      <div className="ml-2 font-medium text-xs lg:text-base">Application</div>
    </div>,
  ]

  const changeTabCallback = (index) => {
    setTab(index)
  }
  const panels = [
    <div key="1">
      {job && job?.descriptionHtml && DOMPurify && (
        <>
          <div className="bg-white rounded-lg shadow-lg p-6 [&_p]:mb-3">
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(job.descriptionHtml),
              }}
            />

            <div
              className="pt-10 mb-6"
              onClick={() => {
                setTab(TABS_ENUM.application)
                window.scrollTo(0, 0)
              }}
            >
              <PrimaryButton>Apply for this Job</PrimaryButton>
            </div>
          </div>
        </>
      )}
    </div>,
    <div key={`application-${jobId}`}>
      <div id="ashby_embed" className="max-w-lg" />
    </div>,
  ]

  useEffect(() => {
    if (!window.ashbyJobsOptions) {
      const script = document.createElement('script')
      script.src = 'https://jobs.ashbyhq.com/goodparty/embed?version=2'
      document.body.appendChild(script)
    }
  }, [])

  useEffect(() => {
    if (job) {
      setJobId(job.id)
    }
  }, [job])

  useEffect(() => {
    if (!jobId) return

    window.__Ashby = {
      settings: {
        ashbyBaseJobBoardUrl: 'https://jobs.ashbyhq.com/goodparty/',
        displayMode: 'application-form-only',
        jobPostingId: jobId,
        autoLoad: true,
        autoScroll: false,
        verboseLogging: true,
      },
    }
  }, [jobId])

  return (
    <MaxWidth>
      <div className="mt-6 mb-6">
        <Link href="/work-with-us">
          <PrimaryButton>
            <ArrowBackIos className="mr-2" />
            All Jobs
          </PrimaryButton>
        </Link>
      </div>

      <H3 data-cy="opening-title" className="text-violet-600">
        {job.title}
      </H3>
      <div className="text-sm">
        {job.departmentName} • {job.locationName} • {job.employmentType}
      </div>
      <div className="mb-6"></div>

      <Tabs
        tabLabels={labels}
        tabPanels={panels}
        activeTab={tab}
        changeCallback={changeTabCallback}
      />
    </MaxWidth>
  )
}

JobPage.propTypes = {}

export default JobPage
