import PrimaryButton from '@shared/buttons/PrimaryButton';
import H2 from '@shared/typography/H2';
import Subtitle1 from '@shared/typography/Subtitle1';
import Link from 'next/link';

export default function QuestionProgress({ campaign, candidatePositions }) {
  const totalQuestions = 6;
  let answeredQuestions = 0;
  const { customIssues } = campaign;
  const issuesCount =
    (customIssues?.length || 0) + candidatePositions?.length || 0;
  if (campaign.details) {
    const { occupation, funFact, pastExperience, website } =
      campaign.details || {};

    const { runningAgainst } = campaign.goals || {};
    if (occupation) {
      answeredQuestions++;
    }
    if (funFact) {
      answeredQuestions++;
    }
    if (pastExperience) {
      answeredQuestions++;
    }
    if (issuesCount >= 3) {
      answeredQuestions++;
    }
    if (website) {
      answeredQuestions++;
    }
    if (runningAgainst) {
      answeredQuestions++;
    }
  }
  let progress = (answeredQuestions * 100) / totalQuestions;
  if (answeredQuestions === totalQuestions) {
    return null;
  }

  return (
    <div className="bg-purple-100 rounded-2xl p-6 grid grid-cols-12">
      <div className=" col-span-12 md:col-span-8 lg:col-span-9">
        <div className="flex justify-between items-baseline">
          <H2>Finish your onboarding to generate content</H2>
          <Subtitle1 className="text-purple-800">
            {answeredQuestions}/{totalQuestions} questions finished
          </Subtitle1>
        </div>
        <div className="mt-3 relative bg-white rounded-2xl h-2">
          <div
            className="absolute top-0 left-0 bg-primary rounded-2xl h-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      <div className=" col-span-12 md:col-span-4 lg:col-span-3 justify-end flex">
        <Link href={`/dashboard/questions?generate=all`}>
          <PrimaryButton>Continue to questions</PrimaryButton>
        </Link>
      </div>
    </div>
  );
}
