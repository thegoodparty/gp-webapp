'use client';
import managerFields from '../managerFields';
import { FaChevronDown } from 'react-icons/fa';
import { useState } from 'react';
import Link from 'next/link';

export default function CampaignAccordion(props) {
  const [selected, setSelected] = useState(false);

  const handleSelect = (index) => {
    if (selected === index) {
      setSelected(false);
    } else {
      setSelected(index);
    }
  };

  return (
    <div className="py-8">
      {managerFields.map((section, index) => (
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
                    <article
                      key={field.title}
                      className="col-span-12 md:col-span-4 lg:col-span-3 bg-slate-100 rounded-lg p-6 flex justify-between flex-col"
                    >
                      <div>
                        <h3 className="font-semibold text-xl">{field.title}</h3>
                        <div className="text-sm mt-4 mb-9">
                          {field.description}
                        </div>
                      </div>
                      {field.type === 'link' && (
                        <Link
                          href={field.href}
                          className="text-violet-600 font-bold"
                        >
                          {field.cta}
                        </Link>
                      )}
                    </article>
                  ))}
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
