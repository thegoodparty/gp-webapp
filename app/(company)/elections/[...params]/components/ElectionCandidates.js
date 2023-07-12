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

export default function ElectionCandidates(props) {
  const { content, city } = props;
  if (!content.candidates || content.candidates.length === 0) {
    return null;
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
        <div className="flex flex-col lg:flex-row w-full flex-auto mt-20 justify-stretch items-center">
          {content.candidates.map((candidate) => (
            <div
              className="flex w-auto justify-center justify-items-center mb-20 h-full"
              key={candidate.slug}
            >
              <div className="flex flex-col items-center justify-center text-slate-50 w-full pl-2 pr-3">
                <AvatarWithTracker
                  candidate={candidate}
                  color={candidate.color ?? colors[0]}
                  candidateUrl={candidateRoute(candidate)}
                />

                <Link href={candidateRoute(candidate)}>
                  <span className=" text-slate-50 text-2xl p-3">
                    {candidate.firstName} {candidate.lastName}
                  </span>
                </Link>

                <CandidatePill
                  text={`${candidate.office}, ${
                    candidate.district ?? candidate.state
                  }`}
                  color={candidate.color ?? colors[0]}
                  className="mt-3"
                />

                <ul className="font-sfpro text-[16px] font-normal max-w-[300px]">
                  <li className="text-slate-50 pt-2">
                    <div className="line-clamp-3">{candidate.topPosition}</div>
                  </li>
                  <li className="text-slate-50 pt-2">{candidate.slogan}</li>
                  <li className="text-slate-50 pt-2">{candidate.occupation}</li>
                </ul>
              </div>
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
