'use client';

import H3 from '@shared/typography/H3';
import Body1 from '@shared/typography/Body1';
import RunningAgainstModule from './RunningAgainstModule';
import { updateCampaignOld } from 'app/(candidate)/onboarding/shared/ajaxActions';

export default function RunningAgainstSection(props) {
  const { campaign, nextCallback, header } = props;
  const handleSave = async (newCampaign) => {
    const updated = campaign;
    if (!updated.goals) {
      updated.goals = {};
    }

    let newAgainst = [...newCampaign.runningAgainst];
    if (newCampaign.newName && newCampaign.newDesc) {
      newAgainst.push({
        name: newCampaign.newName,
        description: newCampaign.newDesc,
        party: newCampaign.newParty,
      });
    }

    updated.goals.runningAgainst = newAgainst;

    await updateCampaignOld(updated);
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
