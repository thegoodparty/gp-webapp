import MaxWidth from '@shared/layouts/MaxWidth';
import CmsContentWrapper from '@shared/content/CmsContentWrapper';
import contentfulHelper from 'helpers/contentfulHelper';
import styles from './Election.module.scss';
import Image from 'next/image';
import InfoButton from '@shared/buttons/InfoButton';
import WarningButton from '@shared/buttons/WarningButton';
import ElectionCandidate from './ElectionCandidate';
import dynamic from 'next/dynamic';

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
          ? 'bg-primary text-slate-50 pb-40'
          : 'bg-slate-50 text-primary'
      } h-auto pt-20 `}
      id="candidate-section"
    >
      <MaxWidth>
        <div
          className={`flex flex-col  pb-5 lg:pl-20 p-10 ${
            theme === 'dark' ? 'text-center' : 'text-left'
          }`}
        >
          <div
            className={`font-sfpro  font-bold  mt-2 ${
              theme === 'dark'
                ? 'text-[32px] md:text-[54px] leading-[36px] md:leading-[64px]'
                : 'text-4xl md:text-6xl'
            }`}
          >
            {candidatesTitle}
          </div>

          <div
            className={`font-sfpro ${
              theme === 'dark' ? 'text-center mt-2' : 'text-left my-6'
            }  text-[18px] leading-6  ${styles.hyperlink}`}
          >
            {theme === 'dark' ? (
              <CmsContentWrapper className="max-w-md">
                {contentfulHelper(candidatesSubTitle)}
              </CmsContentWrapper>
            ) : (
              <>{candidatesSubTitle}</>
            )}
          </div>
        </div>
        <div className="md:flex justify-center flex-wrap items-stretch ">
          {candidates.map((candidate) => (
            <div
              className="md:basis-1/2 xl:basis-1/4  mb-4 "
              key={candidate.slug}
            >
              <ElectionCandidate
                candidate={candidate}
                shortVersion={theme === 'light'}
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
