import MaxWidth from '@shared/layouts/MaxWidth';
import { dateUsHelper } from 'helpers/dateHelper';
import PositionFaq from './PositionFaq';
import { Fragment } from 'react';

export default function PositionFaqs({ race }) {
  const {
    filingDateStart,
    frequency,
    normalizedPositionName,
    filingOfficeAddress,
    filingPhoneNumber,
    paperworkInstructions,
    filingRequirements,
    isRunoff,
    partisanType,
    positionName,
    loc,
  } = race;
  const term = frequency.match(/\d+/g);

  const faqs = [
    {
      q: `How often is ${normalizedPositionName} elected?`,
      a: `Every ${term} years.`,
    },
    {
      q: `What does it mean for an election to be ${partisanType}?`,
      a: `something here`,
    },
    {
      q: `What are the filing requirements to get on the ballot in ${loc}?`,
      a: filingRequirements,
    },
    {
      q: `Where do I submit my candidate paperwork?`,
      a: paperworkInstructions,
    },
    {
      q: `Where is the filing office?`,
      a: filingOfficeAddress,
    },
    {
      q: `How can I get in touch with the filing office?`,
      a: filingPhoneNumber,
    },
    {
      q: `How do I get started running for ${positionName}?`,
      a: dateUsHelper(filingDateStart),
    },
    {
      q: `Is there a primary or runoff election for this office??`,
      a: isRunoff ? 'Yes' : 'No',
    },
  ];
  return (
    <section className="py-12 bg-primary text-white">
      <MaxWidth>
        <h2 className=" text-center text-5xl mb-12">FAQ</h2>
        {faqs.map((faq) => (
          <Fragment key={faq.q}>
            <PositionFaq {...faq} />
          </Fragment>
        ))}
      </MaxWidth>
    </section>
  );
}
