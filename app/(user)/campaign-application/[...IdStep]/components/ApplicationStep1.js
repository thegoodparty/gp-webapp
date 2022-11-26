'use client';
/**
 *
 * ApplicationStep1
 *
 */

import React, { useState, useEffect } from 'react';

import BlackCheckboxClient from '@shared/inputs/BlackCheckboxClient';
import ApplicationWrapper from './ApplicationWrapper';
import { APPLICATION_CARDS_1 } from './fields';

function ApplicationStep1({
  step,
  application,
  updateApplicationCallback,
  reviewMode,
  standAlone,
  standAloneCanSubmitCallback = () => {},
}) {
  const [state, setState] = useState({
    disAffiliate: false,
    notJoin: false,
    noPay: false,

    alternative: false,
    fundraising: false,
    nopartisan: false,

    honest: false,
    transparent: false,
    choices: false,
  });

  useEffect(() => {
    if (application?.pledge) {
      setState({
        ...application.pledge,
      });
    }
  }, [application]);

  const onChangeField = (key, value) => {
    const updatedState = {
      ...state,
      [key]: value,
    };
    setState(updatedState);
    const isCompleted =
      updatedState.disAffiliate &&
      updatedState.notJoin &&
      updatedState.noPay &&
      updatedState.alternative &&
      updatedState.fundraising &&
      updatedState.nopartisan &&
      updatedState.honest &&
      updatedState.transparent &&
      updatedState.choices;

    updateApplicationCallback(application.id, {
      ...application,
      pledge: {
        ...updatedState,
        isCompleted,
      },
    });
    standAloneCanSubmitCallback(isCompleted);
  };

  const canSubmit = () =>
    state.disAffiliate &&
    state.notJoin &&
    state.noPay &&
    state.alternative &&
    state.fundraising &&
    state.nopartisan &&
    state.honest &&
    state.transparent &&
    state.choices;
  console.log('CanSubmit:', state)
  const WrapperElement = ({ children }) => {
    if (standAlone) {
      return <div>{children}</div>;
    } else {
      return (
        <ApplicationWrapper
          step={step}
          canContinue={canSubmit()}
          id={application.id}
          reviewMode={reviewMode}
          standAlone={standAlone}
        >
          {children}
        </ApplicationWrapper>
      );
    }
  };
  return (
    <WrapperElement>
      <h1
        className="text-xl mb-8 md:text-4xl"
        data-cy="step-title"
      >
        {!standAlone && 'Step 1: '}Take the Good Party Pledge to get started
      </h1>
      <div 
        className="text-black text-base leading-6 tracking-wide md:text-xl md:leading-7 mb-6 md:mb-9"
        data-cy="step-subtitle"
      >
        Good Party candidates take a pledge to be{' '}
        <strong>Honest, Independent and People-Powered</strong>.
      </div>
      {APPLICATION_CARDS_1.map((card) => (
        <div 
          clsasName="text-stone-50 rounded-lg p-4 mb-2"
          key={card.title} 
          data-cy="step-card"
        >
          <div 
            className="text-black text-base leading-6 tracking-wide md:text-xl md:leading-7 font-semibold uppercase flex items-center mb-2"
            data-cy="step-card-title"
          >
            {card.icon}
            {card.title}
          </div>
          <div 
            className="text-black text-sm leading-5 tracking-wide md:text-base md:leading-6 font-medium mb-7"
            data-cy="step-card-subtitle"
          >
            {card.subtitle}
          </div>
          {card.checkboxes.map((item) => (
            <div 
              className="text-black text-sm leading-5 tracking-wide md:text-base md:leading-6 flex items-start mb-4"
              key={item.id} 
              data-cy="card-checkbox"
            >
              <BlackCheckboxClient
                value={state[item.id]}
                onChange={(e) => onChangeField(item.id, e.target.checked)}
                disabled={reviewMode}
                data-cy="card-check-box"
              />
              <div dangerouslySetInnerHTML={{ __html: item.text }} />
            </div>
          ))}
        </div>
      ))}
    </WrapperElement>
  );
}
export default ApplicationStep1;
