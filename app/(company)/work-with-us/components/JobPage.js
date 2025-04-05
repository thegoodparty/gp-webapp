'use client'
import React, { useEffect, useState } from 'react'
import Tabs from '@shared/utils/Tabs'
import H3 from '@shared/typography/H3'
import MaxWidth from '@shared/layouts/MaxWidth'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import { ArrowBackIos } from '@mui/icons-material'
import Link from 'next/link'
import DOMPurify from 'isomorphic-dompurify'

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

  const TABS_ENUM = {
    overview: 0,
    application: 1,
  }

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
                // scroll to the top of the page
                window.scrollTo(0, 0)
              }}
            >
              <PrimaryButton>Apply for this Job</PrimaryButton>
            </div>
          </div>
        </>
      )}
    </div>,
    <div key="2">
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
    window.__Ashby = {
      settings: {
        ashbyBaseJobBoardUrl: 'https://jobs.ashbyhq.com/goodparty/',

        // The accepted display modes are:
        // "full-job-board": Will allow the user to navigate the full job board, between the list of applications and postings
        // "application-form-only": Will only show the application of a single job posting. jobPostingId must be set.
        displayMode: 'application-form-only',

        // The initial job posting to render.
        // If in a SPA, this can be left blank, with autoLoad = false, to prevent the iframe from rendering immediately.
        jobPostingId: jobId,
        autoLoad: true,

        // Will prevent scrolling of the iFrame on navigation
        autoScroll: false,

        // Enable verbose logging to the console. This can help for debugging, but should ideally not be used in production.
        verboseLogging: true,

        // This custom css url will be embedded in the iframe, in addition to any global job board css files you have
        // added in the Ashby admin. Passing this to the `load` function will allow you to customize css per
        // application, if needed.
        // customCssUrl:
        //   'https://www.ashbyhq.com/job_board_example_css/application-form-only.css',
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
