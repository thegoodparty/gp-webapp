'use client';
/**
 *
 * ApplicationStep7
 *
 */

import React, { useState, useEffect } from 'react';
import { FaCheck } from 'react-icons/fa';
import { FiMinusCircle } from 'react-icons/fi';
import Link from 'next/link';
import { isValidPhone } from '@shared/inputs/PhoneInput';
import { step2fields, step2Socials, step3Fields, step3Socials } from './fields';
import ApplicationWrapper from './ApplicationWrapper';


// const requiredKeys = [];
// step2fields.forEach(field => {
//   if (field.required) {
//     requiredKeys.push(field);
//   }
// });

const allFields = [
  [{ stepKey: 'candidate' }, ...step2fields],
  [{ stepKey: 'campaign' }, ...step3Fields],
  [{ stepKey: 'socialMedia' }, ...step2Socials, ...step3Socials],
];

function ApplicationStep7({
  step,
  application,
  submitApplicationCallback,
  reviewMode,
}) {
  const [state, setState] = useState([]);
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {
    let requiredFilled = true;
    if (application) {
      const sections = [
        {
          title: '1. Good Party Pledge',
          fields: [
            {
              label: 'Pledged',
              required: true,
              completed: application.pledge?.isCompleted,
            },
          ],
        },
        {
          title: '2. Candidate Details',
          fields: [],
        },
        {
          title: '3. Campaign Details',
          fields: [],
        },
        {
          title: '4. Social Media',
          fields: [],
        },
        {
          title: '5. Top Issues',
          fields: [],
        },
        {
          title: '6. Key Endorsements',
          fields: [],
        },
      ];
      requiredFilled = application.pledge?.isCompleted;

      allFields.forEach((stepFields, index) => {
        const { stepKey } = stepFields[0];
        stepFields.forEach((field) => {
          if (field.label) {
            let completed =
              application[stepKey] &&
              application[stepKey][field.key] !== field.defaultValue;
            if (
              field.type === 'phone' &&
              !isValidPhone(application[stepKey][field.key])
            ) {
              completed = false;
              requiredFilled = false;
            }
            sections[index + 1].fields.push({
              label: field.shortLabel || field.label,
              required: field.required,
              completed,
            });
            if (field.required && !completed) {
              requiredFilled = false;
            }
          }
        });
      });
      // issues
      let issuesCount = 0;
      const topIssues = application.topIssues;
      if (topIssues) {
        for (let i = 0; i < topIssues.length; i++) {
          if (topIssues[i].selectedTopic && topIssues[i].selectedPosition) {
            issuesCount++;
          }
        }
      }
      sections[4].fields.push({
        label:
          issuesCount === 0
            ? 'No issues selected'
            : `${issuesCount} issue${issuesCount > 1 ? 's' : ''} completed`,
        completed: issuesCount > 0,
        required: true,
      });
      if (issuesCount === 0) {
        requiredFilled = false;
      }
      // endorsements
      const endorsementsCount = application.endorsements?.length || 0;
      sections[5].fields.push({
        label:
          endorsementsCount === 0
            ? 'No endorsements provided'
            : `${endorsementsCount} endorsements${
                endorsementsCount > 1 ? 's' : ''
              } provided`,
        completed: endorsementsCount > 0,
      });

      setState(sections);
      setCanSubmit(requiredFilled);
    }
  }, [application]);
  return (
    <ApplicationWrapper
      step={step}
      canContinue={canSubmit}
      id={application.id}
      submitApplicationCallback={submitApplicationCallback}
      reviewMode={reviewMode}
    >
        <h1
            className="text-xl mb-8 md:text-4xl"
            data-cy="step-title"
        >
            Step 7: Review Application Checklist
        </h1>
        {state.map((section, index) => (
            <div className="mb-7" key={index}>
                <Link
                    href={`/campaign-application/${application.id}/${index + 1}`}
                >
                    {/* Body14: text-stone-500 text-sm leading-5 md:text-lg md:leading-6 */}
                    <div className="text-zinc-900 font-semibold uppercase mb-4 text-sm leading-5 md:text-lg md:leading-6">
                        {section.title}
                    </div>
                </Link>
                {section.fields.map((field, index) => (
                    <div
                        className={`text-zinc-500 text-sm leading-5 md:text-lg md:leading-6 font-medium flex items-center mb-3 ${field.completed && 'text-lime-500'}`} 
                        key={index}
                    >
                        <div className="mr-2">
                            {field.completed ? <FaCheck /> : <FiMinusCircle />}
                        </div>{' '}
                        <div>{field.label}</div>
                        {
                            !field.completed && field.required && 
                            <div className="ml-2 text-pink-600">Required</div>
                        }
                    </div>
                ))}
            </div>
        ))}
    </ApplicationWrapper>
  );
}

export default ApplicationStep7;
