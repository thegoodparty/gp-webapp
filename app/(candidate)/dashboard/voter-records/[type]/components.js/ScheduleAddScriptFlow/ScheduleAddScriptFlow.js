'use client';
import { useState } from 'react';
import { ChooseScriptAddFlow } from 'app/(candidate)/dashboard/voter-records/[type]/components.js/ScheduleAddScriptFlow/ChooseScriptAddFlow';
import { ADD_SCRIPT_FLOW } from 'app/(candidate)/dashboard/voter-records/[type]/components.js/ScheduleAddScriptFlow/AddScriptFlow';
import { SelectSmSScriptScreen } from 'app/(candidate)/dashboard/voter-records/[type]/components.js/ScheduleAddScriptFlow/SelectSmSScriptScreen';
import { CreateSmSScriptScreen } from 'app/(candidate)/dashboard/voter-records/[type]/components.js/ScheduleAddScriptFlow/CreateSmSScriptScreen';

export default function ScheduleAddScriptFlow({
  onComplete = (scriptKey) => {},
  backCallback,
  campaign,
}) {
  const [currentScreen, setCurrentScreen] = useState(
    ADD_SCRIPT_FLOW.CHOOSE_FLOW,
  );

  const onBack = (screen) => {
    if (!screen) return backCallback();
    setCurrentScreen(screen);
  };

  const onNext = (screen) => {
    setCurrentScreen(screen);
  };

  return (
    <div className="p-4 w-[80vw] max-w-xl">
      {currentScreen === ADD_SCRIPT_FLOW.CHOOSE_FLOW && (
        <ChooseScriptAddFlow onBack={onBack} onNext={onNext} />
      )}
      {currentScreen === ADD_SCRIPT_FLOW.SELECT_SMS && (
        <SelectSmSScriptScreen
          aiContent={campaign.aiContent}
          onBack={() => onBack(ADD_SCRIPT_FLOW.CHOOSE_FLOW)}
          onNext={(scriptKey) => onComplete(scriptKey)}
        />
      )}
      {currentScreen === ADD_SCRIPT_FLOW.CREATE_SMS && (
        <CreateSmSScriptScreen
          onBack={() => onBack(ADD_SCRIPT_FLOW.CHOOSE_FLOW)}
          onNext={(scriptText) => onComplete(scriptText)}
        />
      )}
    </div>
  );
}
