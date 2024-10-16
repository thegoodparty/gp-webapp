import { useState } from 'react';
import H1 from '@shared/typography/H1';
import Body1 from '@shared/typography/Body1';
import { SmsScriptSelect } from 'app/(candidate)/dashboard/voter-records/[type]/components.js/ScheduleAddScriptFlow/SmsScriptSelect';
import { AddScriptFooter } from 'app/(candidate)/dashboard/voter-records/[type]/components.js/ScheduleAddScriptFlow/AddScriptFooter';

export const SelectSmSScriptScreen = ({
  aiContent,
  onBack = () => {},
  onNext = (scriptKey) => {},
}) => {
  const [smsScript, setSmsScript] = useState(null);
  const handleOnNext = () => onNext(smsScript);
  const onSelect = (key) => setSmsScript(key);
  return (
    <>
      <header className="text-center">
        <H1>Attach Saved Script</H1>
        <Body1 className="mt-4 mb-8">Attach your script below.</Body1>
      </header>
      <div className="mt-6">
        <SmsScriptSelect
          aiContent={aiContent}
          selectedKey={smsScript}
          onSelect={onSelect}
        />
      </div>
      <AddScriptFooter
        onBack={onBack}
        onNext={handleOnNext}
        disabled={!smsScript}
        nextText="Submit"
      />
    </>
  );
};
