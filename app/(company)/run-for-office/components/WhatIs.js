import { FiInfo } from 'react-icons/fi';
import { AiTwotoneTool } from 'react-icons/ai';
import { FaUserAlt } from 'react-icons/fa';
import RunCampaignButton from './RunCampaignButton';

const points = [
  { text: 'On-demand, expert advice', icon: <FiInfo /> },
  { text: 'Free, automated tools', icon: <AiTwotoneTool /> },
  { text: 'Campaign management', icon: <FaUserAlt /> },
];

export default function WhatIs() {
  return (
    <div className="border-t border-b border-neutral-300 py-8 grid grid-cols-12 gap-3 items-center">
      <div className="col-span-12 lg:col-span-7">
        <h3 className="text-lg font-light">WHAT IS GOOD PARTY</h3>
        <div className="font-black text-2xl lg:pr-36">
          We help first-time and incumbent independent candidates run better
          campaigns. Get access to free tools and expert knowledge to reach the
          voters, volunteers, and donors you need without the party politics.
        </div>
      </div>
      <div className="col-span-12 mt-6 lg:mt-0 lg:col-span-5 flex justify-center flex-col">
        {points.map((point) => (
          <div
            key={point.text}
            className="bg-darkPurple mb-1 text-white font-bold rounded-xl flex justify-between items-center px-6 py-5"
          >
            <div className="text-xl">{point.text}</div>
            <div className="text-2xl">{point.icon}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
