import MaxWidth from '@shared/layouts/MaxWidth'
import PositionFaq from './PositionFaq'
import { Fragment } from 'react'

export default function PositionFaqs({ race }) {
  const {
    frequency,
    normalizedPositionName,
    filingOfficeAddress,
    filingPhoneNumber,
    paperworkInstructions,
    filingRequirements,
    isRunoff,
    isPrimary,
    partisanType,
    loc,
  } = race
  const term = frequency?.[0] || 'N/A'

  let runOffPrimary = ''
  if (!isRunoff && !isPrimary) {
    runOffPrimary = `The next election for ${normalizedPositionName} does not include a primary or runoff election.`
  } else if (isRunoff && isPrimary) {
    runOffPrimary = `The next election for ${normalizedPositionName} includes both a primary and runoff election.`
  } else if (isRunoff && !isPrimary) {
    runOffPrimary = `The next election for ${normalizedPositionName}  includes a primary, but not a runoff election.`
  } else if (!isRunoff && isPrimary) {
    runOffPrimary = `The next election for ${normalizedPositionName}  includes a runoff, but not a primary election.`
  }

  const faqs = [
    {
      q: `How often is ${normalizedPositionName} elected?`,
      a: `The position of ${normalizedPositionName} is typically elected every ${term} years.`,
    },
    {
      q: `What does it mean for an election to be ${partisanType?.toLowerCase()}?`,
      a: `${
        partisanType?.toLowerCase() === 'partisan'
          ? 'Partisan elections require candidates to declare a party affiliation, like Democrat, Republican, Libertarian, or Independent.'
          : 'Nonpartisan elections do not require candidates to declare a party affiliation.'
      }`,
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
      a: `${filingOfficeAddress}.`,
    },
    {
      q: `How can I get in touch with the filing office?`,
      a: `You can contact the filing office by calling ${filingPhoneNumber}.`,
    },
    {
      q: `How do I get started running for ${normalizedPositionName}?`,
      a: `You can start running for ${normalizedPositionName} by checking to ensure you meet all filing deadlines and requirements. Next, you can prepare to file for office and start planning your campaign strategy. Get in touch with our team of campaign experts for help with any step of the campaign process!`,
    },
    {
      q: `Is there a primary or runoff election for this office?`,
      a: runOffPrimary,
    },
  ]
  return (
    <section className="py-12 bg-primary-dark text-white">
      <MaxWidth>
        <h2 className=" text-center text-5xl mb-12">FAQ</h2>
        {faqs.map((faq) => (
          <Fragment key={faq.q}>
            <PositionFaq {...faq} />
          </Fragment>
        ))}
      </MaxWidth>
    </section>
  )
}
