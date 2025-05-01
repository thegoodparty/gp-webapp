import Body2 from '@shared/typography/Body2'
import H3 from '@shared/typography/H3'
import H5 from '@shared/typography/H5'
import Chip from '@shared/utils/Chip'
import { dateUsHelper } from 'helpers/dateHelper'
import { Fragment } from 'react'
import { useTenDLC } from 'app/shared/hooks/useTenDLC'

export default function TextMessagingRequest({ request }) {
  const [compliance] = useTenDLC()
  const {
    status,
    message,
    date,
    name,
    script,
    audience_superVoters,
    audience_likelyVoters,
    audience_unreliableVoters,
    audience_unlikelyVoters,
    audience_firstTimeVoters,
    party_independent,
    party_democrat,
    party_republican,
    age_18_25,
    age_25_35,
    age_35_50,
    age_50_plus,
    gender_male,
    gender_female,
    gender_unknown,
    audience_request,
  } = request

  const audienceFields = [
    { label: 'Super Voters', value: audience_superVoters },
    { label: 'Likely Voters', value: audience_likelyVoters },
    { label: 'Unreliable Voters', value: audience_unreliableVoters },
    { label: 'Unlikely Voters', value: audience_unlikelyVoters },
    { label: 'First Time Voters', value: audience_firstTimeVoters },
    { label: 'Independent', value: party_independent },
    { label: 'Democrat', value: party_democrat },
    { label: 'Republican', value: party_republican },
    { label: '18-25', value: age_18_25 },
    { label: '25-35', value: age_25_35 },
    { label: '35-50', value: age_35_50 },
    { label: '50+', value: age_50_plus },
    { label: 'Male', value: gender_male },
    { label: 'Female', value: gender_female },
    { label: 'Unknown', value: gender_unknown },
  ]

  const fields = [
    { label: 'Message', value: message },
    { label: 'Date', value: date ? dateUsHelper(date) : '' },
    { label: 'Script', value: script },
  ]

  const audienceRequest = audience_request

  return (
    <div className="p-4 border border-gray-200 rounded">
      <H3>{name}</H3>
      {compliance ? (
        <Chip
          className="mt-2 mb-4 bg-green-100 text-green-800"
          label={status}
        />
      ) : (
        <Chip
          className="mt-2 mb-4 bg-red-100 text-red-800"
          label="Blocked by 10 DLC Compliance"
        />
      )}

      {fields.map((field) => (
        <Body2 className="mb-1" key={field.label}>
          {field.label}: {field.value}
        </Body2>
      ))}

      <H5 className="mt-4 mb-2">Audience</H5>
      {audienceFields.map((field) => (
        <Fragment key={field.label}>
          {field.value && (
            <Body2
              className="mb-1 mr-1 border-r border-gray-200 pr-2 inline-block"
              key={field.label}
            >
              {field.label}
            </Body2>
          )}
        </Fragment>
      ))}
      {audienceRequest && (
        <Body2 className="mb-1">Audience Request: {audienceRequest}</Body2>
      )}
    </div>
  )
}
