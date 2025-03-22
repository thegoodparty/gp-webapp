import Image from 'next/image';

export default function TempRequest({ textCampaignRequest }) {
  return (
    <div className="mt-4 text-xs bg-gray-100 p-4 rounded-md">
      <pre style={{ whiteSpace: 'pre-wrap' }}>
        <code>
          <div>
            <strong>Budget:</strong> ${textCampaignRequest.budget}
          </div>

          <div>
            <strong>Audience Targeting:</strong>
          </div>
          <ul>
            <li>
              Super Voters:{' '}
              {textCampaignRequest.audience.audience_superVoters ? 'Yes' : 'No'}
            </li>
            <li>
              Likely Voters:{' '}
              {textCampaignRequest.audience.audience_likelyVoters
                ? 'Yes'
                : 'No'}
            </li>
            <li>
              Unreliable Voters:{' '}
              {textCampaignRequest.audience.audience_unreliableVoters
                ? 'Yes'
                : 'No'}
            </li>
            <li>
              Unlikely Voters:{' '}
              {textCampaignRequest.audience.audience_unlikelyVoters
                ? 'Yes'
                : 'No'}
            </li>
            <li>
              First Time Voters:{' '}
              {textCampaignRequest.audience.audience_firstTimeVoters
                ? 'Yes'
                : 'No'}
            </li>
          </ul>

          <div>
            <strong>Party:</strong>
          </div>
          <ul>
            <li>
              Independent:{' '}
              {textCampaignRequest.audience.party_independent ? 'Yes' : 'No'}
            </li>
            <li>
              Democrat:{' '}
              {textCampaignRequest.audience.party_democrat ? 'Yes' : 'No'}
            </li>
            <li>
              Republican:{' '}
              {textCampaignRequest.audience.party_republican ? 'Yes' : 'No'}
            </li>
          </ul>

          <div>
            <strong>Age Groups:</strong>
          </div>
          <ul>
            <li>
              18-25: {textCampaignRequest.audience.age_18_25 ? 'Yes' : 'No'}
            </li>
            <li>
              25-35: {textCampaignRequest.audience.age_25_35 ? 'Yes' : 'No'}
            </li>
            <li>
              35-50: {textCampaignRequest.audience.age_35_50 ? 'Yes' : 'No'}
            </li>
            <li>
              50+: {textCampaignRequest.audience['age_50+'] ? 'Yes' : 'No'}
            </li>
          </ul>

          <div>
            <strong>Gender:</strong>
          </div>
          <ul>
            <li>
              Male: {textCampaignRequest.audience.gender_male ? 'Yes' : 'No'}
            </li>
            <li>
              Female:{' '}
              {textCampaignRequest.audience.gender_female ? 'Yes' : 'No'}
            </li>
            <li>
              Unknown:{' '}
              {textCampaignRequest.audience.gender_unknown ? 'Yes' : 'No'}
            </li>
          </ul>

          <div>
            <strong>Campaign Details:</strong>
          </div>
          <ul>
            <li>Type: {textCampaignRequest.type}</li>
            <li>Date: {textCampaignRequest.date}</li>
          </ul>

          <div>
            <strong>Message:</strong>
          </div>
          <div>{textCampaignRequest.script}</div>
          <Image
            className="mt-4"
            src={textCampaignRequest.image}
            alt="Campaign Image"
            width={500}
            height={300}
          />
        </code>
      </pre>
    </div>
  );
}
