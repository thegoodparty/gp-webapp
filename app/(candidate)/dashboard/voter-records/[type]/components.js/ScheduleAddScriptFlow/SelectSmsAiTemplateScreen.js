'use client';
import { getAiSmsTemplatesFromCategories } from 'helpers/getAiSmsTemplatesFromCategories';
import H1 from '@shared/typography/H1';
import Body1 from '@shared/typography/Body1';
import { AddScriptFooter } from 'app/(candidate)/dashboard/voter-records/[type]/components.js/ScheduleAddScriptFlow/AddScriptFooter';
import { useState } from 'react';
import Link from 'next/link';
import { SmsTemplateSelect } from 'app/(candidate)/dashboard/voter-records/[type]/components.js/ScheduleAddScriptFlow/SmsTemplateSelect';

export const SelectSmsAiTemplateScreen = ({
  onBack = () => {},
  onNext = (scriptKey) => {},
  aiTemplateCategories = [],
}) => {
  const [selectedTemplateKey, setSelectedTemplateKey] = useState('');
  const templates = getAiSmsTemplatesFromCategories(aiTemplateCategories);
  const selectedTemplate = templates.find(
    ({ key }) => key === selectedTemplateKey,
  );

  const handleOnNext = () => {
    onNext(selectedTemplateKey);
  };

  return (
    <>
      <header className="text-center">
        <H1>Generate a New Script</H1>
        <Body1 className="mt-4 mb-8">
          Use our AI to generate the script for your text campaign. Select a
          script type below to get started.
        </Body1>
      </header>
      <section>
        <SmsTemplateSelect
          templates={templates}
          selected={selectedTemplateKey}
          onChange={setSelectedTemplateKey}
        />
        {Boolean(selectedTemplate?.requiresQuestions) && (
          <Body1 className="text-center mt-8">
            <Link
              className="underline text-link"
              href="/dashboard/questions?generate=all"
            >
              Finish entering your information
            </Link>{' '}
            to generate a Get Out The Vote script.
          </Body1>
        )}
      </section>
      <AddScriptFooter
        onBack={onBack}
        onNext={handleOnNext}
        disabled={
          !Boolean(selectedTemplate) || selectedTemplate.requiresQuestions
        }
      />
    </>
  );
};
