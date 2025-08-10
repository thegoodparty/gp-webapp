import Button from '@shared/buttons/Button'
import Body1 from '@shared/typography/Body1'
import MarketingH2 from '@shared/typography/MarketingH2'
import MarketingH4 from '@shared/typography/MarketingH4'
import Paper from '@shared/utils/Paper'
import Image from 'next/image'
import img1 from 'public/images/candidate/build1.png'
import img2 from 'public/images/candidate/build2.png'
import img3 from 'public/images/candidate/build3.png'

const sections = [
  {
    title: 'Run for office',
    description:
      'Discover how you can run for office and make a real impact in your community.',
    image: img1,
    buttonText: 'Start your campaign',
    buttonLink: '/sign-up',
  },
  {
    title: 'GoodParty.org community',
    description:
      'Connect with other independents, and explore opportunities for volunteering and guest posting.',
    image: img2,
    buttonText: 'Join Circle',
    buttonLink: 'https://community.goodparty.org/',
    isExternal: true,
  },
  {
    title: 'Run Independent. Win local.',
    description:
      'A step-by-step guide to running and winning as an independent. Free to download, built to help you win local.',
    image: img3,
    buttonText: 'Download the free e-book',
    buttonLink: 'https://lp.goodparty.org/e-book',
    isExternal: true,
  },
]

export default function BuildSection() {
  return (
    <section className="text-black p-7 lg:p-16 bg-cream-500">
      <div className="max-w-screen-lg mx-auto">
        <div className="text-center">
          <MarketingH2>Build a better democracy with us.</MarketingH2>
          <div className="mt-4 text-lg max-w-[600px] mx-auto">
            Ready to join the movement? Support candidates, run for office or
            join our Circle community of like-minded individuals.
          </div>
        </div>
        {sections.map((section, index) => (
          <Paper key={section.title} className="mt-12 lg:mt-16">
            <div
              className={`lg:flex  items-center lg:justify-between ${
                index === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="text-center lg:text-left lg:ml-8">
                <MarketingH4 className="mt-4 lg:mt-0">
                  {section.title}
                </MarketingH4>
                <Body1 className="mt-4">{section.description}</Body1>
                <Button
                  variant="outlined"
                  style={{ borderRadius: '100px' }}
                  className="mt-4"
                  href={section.buttonLink}
                  target={section.isExternal ? '_blank' : '_self'}
                >
                  {section.buttonText}
                </Button>
              </div>
              <div className="flex justify-center lg:block">
                <Image
                  src={section.image}
                  alt={section.title}
                  width={400}
                  height={400}
                />
              </div>
            </div>
          </Paper>
        ))}
      </div>
    </section>
  )
}
