import Body2 from '@shared/typography/Body2';
import H3 from '@shared/typography/H3';
import H4 from '@shared/typography/H4';
import H5 from '@shared/typography/H5';
import Chip from '@shared/utils/Chip';
import { dateUsHelper } from 'helpers/dateHelper';
import { Fragment } from 'react';
/*
Request example:
extMessaging [
  {
    "id": 2,
    "campaignId": 111,
    "projectId": null,
    "name": "SMS Campaign 4/23/2025",
    "message": "my message",
    "status": "pending",
    "error": null,
    "audience": {
      "age_18_25": false,
      "age_25_35": false,
      "age_35_50": false,
      "party_democrat": false,
      "audience_request": "my audience request",
      "party_republican": false,
      "party_independent": true,
      "audience_superVoters": true,
      "audience_likelyVoters": false,
      "audience_unlikelyVoters": false,
      "audience_firstTimeVoters": false,
      "audience_unreliableVoters": false
    },
    "script": "tete",
    "date": "2025-04-24T00:00:00.000Z",
    "imageUrl": "https://assets.goodparty.org/scheduled-campaign/tomer-almog/sms/2025-04-24/47223899_2200166840225845_8681987273140469760_n.jpg",
    "createdAt": "2025-03-24T01:17:46.358Z",
    "updatedAt": "2025-03-24T01:17:46.358Z"
  }
*/

export default function TextMessagingRequests({ request }) {
  const { status, message, date, name, script, audience } = request;
  const audienceFields = [];
  Object.keys(audience).forEach((key) => {
    if (key !== 'audience_request') {
      audienceFields.push({
        label: key.replace('_', ' '),
        value: audience[key],
      });
    }
  });
  console.log('audienceFields', audienceFields);

  const fields = [
    { label: 'Message', value: message },
    { label: 'Date', value: date ? dateUsHelper(date) : '' },
    { label: 'Script', value: script },
  ];

  const audienceRequest = audience.audience_request;

  return (
    <div className="p-4 border border-gray-200 rounded">
      <H3>{name}</H3>
      <Chip className="mt-2 mb-4 bg-blue-100 text-blue-800" label={status} />

      {fields.map((field) => (
        <Body2 className="mb-1" key={field.label}>
          {field.label}: {field.value}
        </Body2>
      ))}

      <H5 className="mt-4 mb-2">Audience</H5>
      {audienceFields.map((field) => (
        <Fragment key={field.label}>
          {field.value && (
            <Body2 className="mb-1" key={field.label}>
              {field.label}
            </Body2>
          )}
        </Fragment>
      ))}
      {audienceRequest && (
        <Body2 className="mb-1">Audience Request: {audienceRequest}</Body2>
      )}
    </div>
  );
}
