import MaxWidth from '@shared/layouts/MaxWidth';
import CmsContentWrapper from '@shared/content/CmsContentWrapper';
import contentfulHelper from 'helpers/contentfulHelper';
import Image from 'next/image';
import InfoButton from '@shared/buttons/InfoButton';
import WarningButton from '@shared/buttons/WarningButton';
import ElectionCandidate from './ElectionCandidate';

export default function ElectionCandidates(props) {
  const { content, city } = props;
  const theme = props.theme || 'dark';
  const {
    candidates,
    candidatesTitle,
    candidatesSubTitle,
    districtImage,
    districtTitle,
    districtButtonText,
    districtButtonLink,
    districtButton2Text,
    districtButton2Link,
  } = content || {};
  if (!candidates || candidates.length === 0) {
    return null;
  }

  return (
    <section
      className={`${
        theme === 'dark'
          ? 'bg-primary-dark text-slate-50 pb-40 pt-20 '
          : 'bg-slate-50 text-primary pt-4'
      } h-auto `}
      id="candidate-section"
    >
      <MaxWidth>
        <div
          className={`flex flex-col  pb-5 lg:pl-20 p-10 ${
            theme === 'dark' ? 'text-center' : 'text-left'
          }`}
        >
          <div className="font-sfpro  font-bold  mt-2 text-[32px] md:text-[54px] leading-[36px] md:leading-[64px]">
            {candidatesTitle}
          </div>

          <div
            className={`font-sfpro text-center mt-2  text-[18px] leading-6  `}
          >
            <CmsContentWrapper className="max-w-md">
              {contentfulHelper(candidatesSubTitle)}
            </CmsContentWrapper>
          </div>
        </div>
        <div className="md:flex justify-center flex-wrap items-stretch ">
          {candidates.map((candidate, index) => (
            <div
              className="md:basis-1/2 xl:basis-1/4  mb-4 "
              key={candidate.slug}
            >
              <ElectionCandidate
                candidate={candidate}
                shortVersion={theme === 'light'}
                priority={index < 4}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col text-center pb-5 lg:pl-20 p-10">
          {districtImage && (
            <>
              <div className="font-sfpro  font-semibold text-[32px] md:text-[54px] leading-[36px] md:leading-[64px] mt-2">
                {districtTitle}
              </div>
              <div className="flex justify-center">
                <Image
                  src={`https:${districtImage?.url}`}
                  width={584}
                  height={524}
                  alt={`${city} district map`}
                />
              </div>
            </>
          )}
          <div className="flex flex-col md:flex-row justify-center">
            {districtButtonText && (
              <div>
                <a
                  id="district-link"
                  href={districtButtonLink}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  <InfoButton className="whitespace-nowrap">
                    {districtButtonText}
                  </InfoButton>
                </a>
              </div>
            )}
            {districtButton2Text && (
              <div className="mt-4 md:mt-0 md:ml-4">
                <a
                  id="district-link2"
                  href={districtButton2Link}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  <WarningButton className="whitespace-nowrap">
                    {districtButton2Text}
                  </WarningButton>
                </a>
              </div>
            )}
          </div>
        </div>
      </MaxWidth>
    </section>
  );
}
