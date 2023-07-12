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
        <div className="grid grid-cols-12 gap-6 justify-center">
          {content.candidates.length === 2 && (
            <div className="col-span-12 md:col-span-6 lg:col-span-3">
              &nbsp;
            </div>
          )}
          {content.candidates.map((candidate) => (
            <div
              className="col-span-12 md:col-span-6 lg:col-span-3"
              key={candidate.slug}
            >
              <ElectionCandidate candidate={candidate} />
            </div>
          ))}
        </div>

        <div className="flex flex-col text-center pb-5 lg:pl-20 p-10">
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
          <div>
            <a
              id="district-link"
              href={content.districtButtonLink}
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              <WarningButton>{content.districtButtonText}</WarningButton>
            </a>
          </div>
        </div>
      </MaxWidth>
    </section>
  );
}
