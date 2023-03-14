'use client';
import { FaChevronDown } from 'react-icons/fa';
import { useState } from 'react';
import Link from 'next/link';
import CampaignPlanCard from './CampaignPlanCard';

export default function CampaignAccordion(props) {
  const [selected, setSelected] = useState(0);
  const { sections, articlesBySlug, campaign } = props;

  const handleSelect = (index) => {
    if (selected === index) {
      setSelected(false);
    } else {
      setSelected(index);
    }
  };

  return (
    <div className="py-8">
      {sections.map((section, index) => (
        <section key={section.title} className="mb-3 rounded-2xl bg-white">
          <div
            className="flex justify-between items-center p-6 cursor-pointer"
            onClick={() => handleSelect(index)}
          >
            <h2 className="font-bold text-2xl">{section.title}</h2>
            <div
              className={`transition-all duration-300 ${
                index === selected && 'rotate-180'
              }`}
            >
              <FaChevronDown size={24} />
            </div>
          </div>
          <div
            className={`overflow-hidden transition-all duration-300  ${
              index === selected ? 'max-h-[2000px]' : 'max-h-0 '
            }`}
          >
            <div className="p-6 ">
              <div className="border-t border-2 mb-10 border-slate-100"></div>
              <div className="grid grid-cols-12 gap-4">
                {section.fields &&
                  section.fields.map((field) => (
                    <CampaignPlanCard
                      field={field}
                      key={field.title}
                      articlesBySlug={articlesBySlug}
                      campaign={campaign}
                    />
                  ))}
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
