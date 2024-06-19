import { useCampaign } from '@shared/hooks/useCampaign';
import { useState } from 'react';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import { updateCampaignAdminOnly } from 'helpers/updateCampaignAdminOnly';
import { P2VSection } from 'app/admin/victory-path/[slug]/components/P2VSection';
import Checkbox from '@shared/inputs/Checkbox';

export const P2VProSection = () => {
  const [campaign = {}, _, refreshCampaign] = useCampaign();
  const { slug } = campaign;
  const [isPro, setIsPro] = useState(campaign.isPro || false);

  const doCampaignUpdate = async (attr) => {
    await updateCampaign(attr, slug);
    await refreshCampaign();
  };

  const onChangeIsPro = async (e) => {
    const value = e.currentTarget.checked;
    setIsPro(value);
    await updateCampaignAdminOnly({
      slug,
      isPro: value,
    });
    await refreshCampaign();
  };

  return (
    <P2VSection title="Pro Plan Information">
      <div className="flex items-center">
        <Checkbox
          value={isPro}
          defaultChecked={campaign.isPro}
          onChange={onChangeIsPro}
        />
        <div className="ml-2">Is Pro</div>
      </div>
    </P2VSection>
  );
};
