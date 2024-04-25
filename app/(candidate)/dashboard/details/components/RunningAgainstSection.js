'use client';

import H3 from '@shared/typography/H3';
import RunningAgainstModule from './RunningAgainstModule';
import { updateCampaignOld } from 'app/(candidate)/onboarding/shared/ajaxActions';

export default function RunningAgainstSection(props) {
  const { campaign, nextCallback, header } = props;
  const handleSave = async (againstState) => {
    let newAgainst = [...againstState.runningAgainst];
    if (againstState.newName && againstState.newDesc) {
      newAgainst.push({
        name: againstState.newName,
        description: againstState.newDesc,
        party: againstState.newParty,
      });
    }

    await updateCampaignOld(['details.runningAgainst'], [newAgainst]);
    if (nextCallback) {
      nextCallback();
    } else {
      window.location.reload();
    }
  };
  return (
    <section className={` pt-6  ${header ? '' : 'border-t  border-gray-600'}`}>
      {header ? <>{header}</> : <H3>Who You&apos;re Running Against</H3>}
      <RunningAgainstModule
        campaign={campaign}
        handleSave={handleSave}
        smallButton
      />
    </section>
  );
}
