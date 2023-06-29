import MaxWidth from '@shared/layouts/MaxWidth';
import CmsContentWrapper from '@shared/content/CmsContentWrapper';
import contentfulHelper from 'helpers/contentfulHelper';
import AvatarWithTracker from '/app/candidate/[slug]/components/AvatarWithTracker';
import CandidatePill from '/app/candidate/[slug]/components/CandidatePill';
import styles from './Election.module.scss';

export default function ElectionCandidates(props) {
  const { content } = props;

  return (
    <section className="bg-primary h-auto pt-20 pb-40">
      <MaxWidth>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 lg:col-span-6 pb-5 lg:pl-20 max-w-2xl p-10">
            <div className="font-sfpro text-slate-50 font-semibold text-[32px] md:text-[54px] leading-[36px] md:leading-[64px] mt-2">
              {content.candidatesTitle}
            </div>

            <div
              className={`font-sfpro text-slate-50 text-[18px] leading-6 mt-2 max-w-md ${styles.hyperlink}`}
            >
              <CmsContentWrapper>
                {contentfulHelper(content.candidatesSubTitle)}
              </CmsContentWrapper>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6"></div>
        </div>
        <div className="grid grid-cols-12 gap-3 mt-20 justify-items-center">
          {content.candidates.map((candidate, index) => (
            <div
              key={index}
              className="col-span-12 lg:col-span-3 justify-items-center"
            >
              <div className="flex flex-col items-center justify-center text-slate-50 w-full">
                <AvatarWithTracker
                  candidate={candidate}
                  color={candidate.color}
                />
                <span className=" text-slate-50 text-2xl p-3">
                  {candidate.firstName} {candidate.lastName}
                </span>
                <CandidatePill
                  text={`${candidate.office} ${
                    candidate.district ? candidate.district : candidate.state
                  }`}
                  color={candidate.color}
                />

                <ul className="font-sfpro text-[16px] font-normal">
                  <li className="text-slate-50 pt-2">
                    {candidate.topPosition}
                  </li>
                  <li className="text-slate-50 pt-2">{candidate.slogan}</li>
                  <li className="text-slate-50 pt-2">{candidate.occupation}</li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </MaxWidth>
    </section>
  );
}
