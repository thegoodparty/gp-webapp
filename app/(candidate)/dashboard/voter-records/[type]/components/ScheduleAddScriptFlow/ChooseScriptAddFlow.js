'use client';
import H1 from '@shared/typography/H1';
import Body1 from '@shared/typography/Body1';
import RadioList from '@shared/inputs/RadioList';
import { AddScriptFooter } from 'app/(candidate)/dashboard/voter-records/[type]/components/ScheduleAddScriptFlow/AddScriptFooter';
import { ADD_SCRIPT_FLOW } from 'app/(candidate)/dashboard/voter-records/[type]/components/ScheduleAddScriptFlow/AddScriptFlow';
import { useState } from 'react';

export const ChooseScriptAddFlow = ({
  onBack = () => {},
  onNext = (choiceKey = '') => {},
}) => {
  const [selected, setSelected] = useState();
  const handleOnNext = () => {
    onNext(selected);
  };
  return (
    <>
      <header className="text-center">
        <H1>Add a Script</H1>
        <Body1 className="mt-4 mb-8">
          How would you like to add your script?
        </Body1>
      </header>
      <div className="mt-6">
        <RadioList
          options={[
            { key: ADD_SCRIPT_FLOW.SELECT_SMS, label: 'Use a saved script' },
            {
              key: ADD_SCRIPT_FLOW.SELECT_SMS_AI_TEMPLATE,
              label: 'Generate a new script',
            },
            { key: ADD_SCRIPT_FLOW.CREATE_SMS, label: 'Add your own script' },
          ]}
          selected={selected}
          selectCallback={setSelected}
        />
      </div>
      <AddScriptFooter
        onBack={onBack}
        onNext={handleOnNext}
        disabled={!selected}
      />
    </>
  );
};
