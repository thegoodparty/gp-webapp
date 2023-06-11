import Body1 from '@shared/typography/Body1';
import H2 from '@shared/typography/H2';
import H4 from '@shared/typography/H4';
import { CgSandClock } from 'react-icons/cg';
import {
  RiBriefcaseLine,
  RiGameLine,
  RiHeartsLine,
  RiProfileLine,
} from 'react-icons/ri';
import TextPanel from '../TextPanel';

export default function InfoTab(props) {
  const { candidate, previewMode, color, changeTabCallback } = props;
  const { about } = candidate;

  const sections = [
    {
      key: 'about',
      section: 'details',
      title: 'About me',
      icon: <RiProfileLine />,
    },
    {
      key: 'why',
      section: 'campaignPlan',
      title: "Why I'm Running",
      icon: <RiHeartsLine />,
    },
    {
      key: 'occupation',
      section: 'details',
      title: 'Current Occupation',
      icon: <RiBriefcaseLine />,
    },
    {
      key: 'pastExperience',
      section: 'details',
      title: 'Past Experience',
      icon: <CgSandClock />,
    },
    {
      key: 'funFact',
      section: 'details',
      title: 'Fun Fact',
      icon: <RiGameLine />,
    },
  ];

  return (
    <div>
      <H4 className="text-indigo-50 mb-5">Candidate info</H4>
      {sections.map((section, index) => (
        <div key={section.key} className="mb-16">
          {candidate[section.key] && (
            <>
              <div className="flex items-center mb-3">
                <H2>{section.title}</H2>
                <div
                  className="relative py-2 px-4 rounded-full ml-2"
                  style={{ color }}
                >
                  <div
                    className="absolute w-full h-full top-0 left-0 opacity-10 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  {section.icon}
                </div>
              </div>
              <div className={previewMode ? 'h-16 overflow-hidden' : ''}>
                <TextPanel
                  text={candidate[section.key]}
                  {...props}
                  section={section.section}
                  sectionKey={section.key}
                />
              </div>
              {previewMode && (
                <div
                  onClick={() => {
                    changeTabCallback(3);
                  }}
                >
                  <Body1
                    style={{ color }}
                    className="text-right mt-2 cursor-pointer hover:underline"
                  >
                    Read more
                  </Body1>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
