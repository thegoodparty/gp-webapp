'use client';

import H3 from '@shared/typography/H3';
import H5 from '@shared/typography/H5';
import DashboardLayout from 'app/(candidate)/dashboard/shared/DashboardLayout';
import TitleSection from 'app/(candidate)/dashboard/shared/TitleSection';
import { LuMailPlus } from 'react-icons/lu';
import { BsMegaphone } from 'react-icons/bs';
import { FiShare2 } from 'react-icons/fi';
import { GrMicrophone } from 'react-icons/gr';
import { GoPeople } from 'react-icons/go';
import { AiOutlineFlag } from 'react-icons/ai';
import { FaHandHoldingHeart } from 'react-icons/fa';
import { HiOutlineScale } from 'react-icons/hi';
import { SiMinutemailer } from 'react-icons/si';
import { useState } from 'react';
import { CircularProgress } from '@mui/material';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import InputFieldsModal from './InputFieldsModal';
import Subtitle1 from '@shared/typography/Subtitle1';
import Caption from '@shared/typography/Caption';
import { calcAnswers } from '../../plan/components/QuestionProgress';

const categoryIcons = {
  'Email & Correspondence': <LuMailPlus className="text-purple-300" />,
  'Email Blasts': <SiMinutemailer className="text-purple-300" />,
  'Media & PR': <BsMegaphone className="text-orange-600" />,
  'Social Media Content': <FiShare2 className="text-cyan-600" />,
  'Speeches & Scripts': <GrMicrophone className="text-purple-800" />,
  'Outreach & Community Engagement': <GoPeople className="text-lime-900" />,
  'Campaign Milestones': <AiOutlineFlag className="text-green-600" />,
  'Issues & Policy': <HiOutlineScale className="text-cyan-800" />,
  'Endorsements & Partnerships': (
    <FaHandHoldingHeart className="text-red-400" />
  ),
};

export default function TemplateList(props) {
  const {
    categories,
    onSelectCallback,
    selectedKey,
    requiresQuestions,
    campaign,
    candidatePositions,
  } = props;

  const handleClick = (key) => {
    if (requiresQuestions[key]) {
      // check if the questions are already answered
      const { answeredQuestions, totalQuestions } = calcAnswers(
        campaign,
        candidatePositions,
      );

      if (answeredQuestions >= totalQuestions) {
        onSelectCallback(key);
      }
    } else {
      onSelectCallback(key);
    }
  };

  return (
    <>
      {categories.map((category) => (
        <div key={category.name} className="mt-9 mb-4">
          <H3>{category.name}</H3>
          <div className="grid grid-cols-12 gap-3 mt-4">
            {category.templates.map((template) => (
              <div
                key={template.key}
                className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
              >
                <div
                  onClick={() => {
                    handleClick(template.key);
                  }}
                  className={`bg-gray-50 border flex md:flex-col  rounded-xl pt-5 px-7 pb-5 md:pb-14 ${
                    selectedKey === template.key
                      ? ' shadow-lg border-black'
                      : 'border-slate-700'
                  } transition duration-300 ease-in-out  
                  
                  ${
                    requiresQuestions[template.key]
                      ? 'opacity-40 cursor-not-allowed'
                      : 'cursor-pointer hover:shadow-lg'
                  }
                  
                  `}
                >
                  <div className="mr-3 md:mr-0 md:mb-4 text-2xl ">
                    {categoryIcons[category.name]}
                  </div>
                  <H5>{template.name}</H5>
                </div>
                {requiresQuestions[template.key] && (
                  <Caption className="mt-2 text-center">
                    Answer all questions to unlock
                  </Caption>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
