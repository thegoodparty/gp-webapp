'use client';

import { memo } from 'react';
import CampaignSnippet from './CampaignSnippet';
import H5 from '@shared/typography/H5';
import H3 from '@shared/typography/H3';
import Body1 from '@shared/typography/Body1';
import Button from '@shared/buttons/Button';
import { useUser } from '@shared/hooks/useUser';
import { ZoomOutMapRounded } from '@mui/icons-material';
import { numberFormatter } from 'helpers/numberHelper';

export default memo(function Results({
  campaigns,
  totalNumCampaigns,
  onSelectCampaign,
  selectedCampaign,
  onZoomOut,
}) {
  const user = useUser();
  const viewingSubset = campaigns.length < totalNumCampaigns;

  return (
    <div className="md:w-[400px] lg:w-[500px] h-80  md:h-[calc(100vh-56px-298px)] border-r border-gray-300 md:overflow-y-auto bg-indigo-100 overflow-auto">
      <H5 className="p-6 flex gap-2 items-center">
        Viewing {campaigns.length ? numberFormatter(campaigns.length) : ''}{' '}
        candidates
        {viewingSubset && (
          <>
            <span className="font-normal">
              ({totalNumCampaigns ? numberFormatter(totalNumCampaigns) : ''}{' '}
              total)
            </span>
            <Button
              onClick={onZoomOut}
              size="small"
              color="white"
              className="ml-auto flex gap-2 items-center"
            >
              <ZoomOutMapRounded className="text-sm" />
              Zoom Out
            </Button>
          </>
        )}
      </H5>
      {campaigns.map((campaign) => (
        <CampaignSnippet
          key={campaign.slug}
          campaign={campaign}
          onSelectCampaign={onSelectCampaign}
          selectedCampaign={selectedCampaign}
        />
      ))}
      {campaigns.length === 0 && (
        <div className="px-4">
          <div className="px-6 py-8 lg:py-24 bg-white rounded-2xl border border-slate-300 text-center">
            <H3>No results found</H3>
            <Body1 className="mt-2 mb-8">
              Know a candidate? Share GoodParty.org with them to get them listed
              on the map.
            </Body1>

            <a
              href={`mailto:?subject=Question about your campaign&body=Hi there,%0A%0AI ran across this site when researching candidates running for office in my area that are running people-powered, non-partisan campaigns.%0A%0AI didn’t notice your name on here, and think your campaign would be a great fit alongside other community powered candidates. If you’d like to be featured on the map, this organization (GoodParty.org) noted that you can get in touch by creating an account at goodparty.org/sign-up.%0A%0AThank you for stepping up to serve our community. I hope to celebrate your victory on election night!%0A%0ABest,${user.firstName} ${user.lastName}`}
            >
              <Button variant="primary">Invite a Candidate</Button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
});
