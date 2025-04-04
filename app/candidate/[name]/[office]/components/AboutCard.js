import Body1 from '@shared/typography/Body1'
import MarketingH4 from '@shared/typography/MarketingH4'
import Overline from '@shared/typography/Overline'
import DescriptionLabel from './DescriptionLabel'

export default function AboutCard(props) {
  const { candidate } = props
  const {
    firstName,
    lastName,
    about,
    jobHistory,
    education,
    militaryService,
    previouslyInOffice,
    priorRoles,
    yearsInOffice,
  } = candidate

  const descLabels = [
    { title: 'Job history', description: jobHistory },
    { title: 'Education', description: education },
    { title: 'Military Service', description: militaryService },
    { title: 'Previously In Office', description: previouslyInOffice },
    { title: 'Total Years In Office', description: yearsInOffice },
  ]

  return (
    <section className="bg-primary-dark border border-gray-700 p-6 rounded-2xl h-full">
      <Overline className="text-gray-400 mb-2">ABOUT</Overline>
      <MarketingH4>
        {firstName} {lastName}
      </MarketingH4>
      {about && (
        <Body1 className="mt-3 mb-8">
          <div dangerouslySetInnerHTML={{ __html: about }} />
        </Body1>
      )}
      {descLabels.map((item) => (
        <DescriptionLabel
          key={item.title}
          title={item.title}
          description={item.description}
        />
      ))}
      {priorRoles && priorRoles.length > 0 && (
        <>
          <Overline className="uppercase text-gray-400">PRIOR ROLES</Overline>
          {priorRoles.map((role, index) => (
            <Body1 className="my-2" key={index}>
              {role.office}
              <br />
              {role.years}
            </Body1>
          ))}
        </>
      )}
    </section>
  )
}
