import Body2 from '@shared/typography/Body2';
import H3 from '@shared/typography/H3';
import H5 from '@shared/typography/H5';
import Chip from '@shared/utils/Chip';
import { dateUsHelper } from 'helpers/dateHelper';
import { Fragment } from 'react';

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
