import MaxWidth from '@shared/layouts/MaxWidth';
import CmsContentWrapper from '@shared/content/CmsContentWrapper';
import contentfulHelper from 'helpers/contentfulHelper';
import AvatarWithTracker from '/app/candidate/[slug]/components/AvatarWithTracker';
import CandidatePill from '/app/candidate/[slug]/components/CandidatePill';
import styles from './Election.module.scss';
import Link from 'next/link';
import { candidateRoute } from 'helpers/candidateHelper';
import { colors } from '/app/candidate/[slug]/components/CandidateColors';
import Image from 'next/image';
import InfoButton from '@shared/buttons/InfoButton';
import WarningButton from '@shared/buttons/WarningButton';
import ElectionCandidate from './ElectionCandidate';

export default function ElectionCandidates(props) {
  const { content, city } = props;
  if (!content.candidates || content.candidates.length === 0) {
    return null;
  }

  let startClass = '';
  if (content.candidates.length === 2) {
    startClass = 'lg:col-start-3';
  }

  return (
    <section className="bg-primary h-auto pt-20 pb-40">
      <MaxWidth>
        <div className="flex flex-col text-center pb-5 lg:pl-20 p-10">
          <div className="font-sfpro text-slate-50 font-semibold text-[32px] md:text-[54px] leading-[36px] md:leading-[64px] mt-2">
            {content.candidatesTitle}
          </div>

          <div
            className={`font-sfpro text-center text-slate-50 text-[18px] leading-6 mt-2 ${styles.hyperlink}`}
          >
            <CmsContentWrapper className="max-w-md">
              {contentfulHelper(content.candidatesSubTitle)}
            </CmsContentWrapper>
          </div>
        </div>
        <div className="md:flex justify-center flex-wrap">
          {content.candidates.map((candidate) => (
            <div className="md:basis-1/2 xl:basis-1/4" key={candidate.slug}>
              <ElectionCandidate candidate={candidate} />
            </div>
          ))}
        </div>

        <div className="flex flex-col text-center pb-5 lg:pl-20 p-10">
          {content?.districtImage && (
            <>
              <div className="font-sfpro text-slate-50 font-semibold text-[32px] md:text-[54px] leading-[36px] md:leading-[64px] mt-2">
                {content.districtTitle}
              </div>
              <div className="flex justify-center">
                <Image
                  src={`https:${content?.districtImage?.url}`}
                  width={584}
                  height={524}
                  alt={`${city} district map`}
                />
              </div>
            </>
          )}
          <div class="flex flex-col md:flex-row justify-center">
            {content?.districtButtonText && (
              <div>
                <a
                  id="district-link"
                  href={content.districtButtonLink}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  <InfoButton className="whitespace-nowrap">
                    {content.districtButtonText}
                  </InfoButton>
                </a>
              </div>
            )}
            {content?.districtButton2Text && (
              <div className="mt-4 md:mt-0 md:ml-4">
                <a
                  id="district-link2"
                  href={content.districtButton2Link}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  <WarningButton className="whitespace-nowrap">
                    {content.districtButton2Text}
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
