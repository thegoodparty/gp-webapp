'use client'
import H4 from '@shared/typography/H4'
import { useEffect, useState } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

export async function loadSuggestedIssues(zip) {
  try {
    const payload = {
      zip,
    }

    const resp = await clientFetch(apiRoutes.topIssue.byLocation, payload)

    return resp.data
  } catch (e) {
    console.log('error at loadSuggestedIssues', e)
    return false
  }
}

export default function SuggestedIssues({ campaign, suggestedCallback }) {
  const [suggested, setSuggested] = useState([])
  useEffect(() => {
    loadIssues()
  }, [])
  const loadIssues = async () => {
    if (campaign?.details?.zip) {
      const issues = await loadSuggestedIssues(campaign.details.zip)
      setSuggested(issues)
    }
  }
  if (!suggested || suggested.length === 0) {
    return null
  }

  return (
    <div className="bg-purple-100 rounded-xl p-4 mb-9">
      <H4>Suggested: Top issues in your community</H4>
      <div className="mt-1">
        {suggested.length > 0 &&
          suggested.map((issue, index) => (
            <div
              key={index}
              className="inline-block py-2 px-3 text-white font-medium rounded-lg bg-purple-400 mr-3 mt-3 whitespace-nowrap cursor-pointer transition-colors hover:bg-purple-600 hover:shadow-md"
              onClick={() => {
                suggestedCallback(issue)
              }}
            >
              {issue}
            </div>
          ))}
      </div>
    </div>
  )
}
