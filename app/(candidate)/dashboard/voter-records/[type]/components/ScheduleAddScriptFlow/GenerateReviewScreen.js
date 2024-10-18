'use client';
import { useEffect, useState } from 'react';
import H1 from '@shared/typography/H1';
import Body1 from '@shared/typography/Body1';
import { AddScriptFooter } from 'app/(candidate)/dashboard/voter-records/[type]/components/ScheduleAddScriptFlow/AddScriptFooter';
import RichEditor from '@shared/utils/RichEditor';
import {
  getCampaign,
  updateCampaign,
} from 'app/(candidate)/onboarding/shared/ajaxActions';
import { useSnackbar } from 'helpers/useSnackbar';

export const GenerateReviewScreen = ({
  aiScriptKey = '',
  onBack = () => {},
  onNext = (scriptKey) => {},
}) => {
  const { errorSnackbar } = useSnackbar();
  const [aiContent, setAiContent] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAiContent = async () => {
      try {
        const { campaign = {} } = await getCampaign();
        const { aiContent } = campaign;
        if (!aiContent?.[aiScriptKey]) {
          throw new Error(`No aiScriptKey AI content found => ${aiScriptKey}`);
        }
        setAiContent(aiContent[aiScriptKey]);
      } catch (e) {
        console.error('error fetching aiContent for review => ', e);
        errorSnackbar('Error fetching AI-generated content');
      }
    };
    fetchAiContent();
  }, []);

  const handleOnNext = async () => {
    setSaving(true);
    try {
      await updateCampaign([
        {
          key: `aiContent.${aiScriptKey}`,
          value: aiContent,
        },
      ]);
      onNext(aiScriptKey);
    } catch (e) {
      console.error('Error updating campaign with AI content => ', e);
      errorSnackbar('Error saving AI-generated content');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <header className="text-center">
        <H1>Review Script</H1>
        <Body1 className="mt-4 mb-8">
          Click in the editor to make any necessary changes.
        </Body1>
      </header>
      <section>
        <RichEditor
          initialText={aiContent?.content}
          onChangeCallback={(content) => {
            setAiContent({ ...aiContent, content });
          }}
          useOnChange
        />
      </section>
      <AddScriptFooter
        onBack={onBack}
        onNext={handleOnNext}
        disabled={!aiContent?.content || saving}
        nextText="Save"
        nextButtonProps={{
          loading: saving,
        }}
      />
    </>
  );
};
