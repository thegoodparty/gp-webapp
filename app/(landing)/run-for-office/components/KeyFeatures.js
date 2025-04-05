import Image from 'next/image'
import contentImg from 'public/images/run-for-office/my-content.png'
import trackerImg from 'public/images/run-for-office/campaign-tracker.png'
import expertsImg from 'public/images/run-for-office/experts.png'
import mapImg from 'public/images/run-for-office/map.png'
import MarketingH3 from '@shared/typography/MarketingH3'
import Body1 from '@shared/typography/Body1'
import MarketingH4 from '@shared/typography/MarketingH4'
import Button from '@shared/buttons/Button'
import { MdArrowForward } from 'react-icons/md'

function CardWrapper({ children, className }) {
  return (
    <div
      className={`px-4 py-8 md:px-8 bg-white rounded-3xl border border-black/[0.12] ${
        className || ''
      }`}
    >
      {children}
    </div>
  )
}

function CTALink({ id, href = '/sign-up' }) {
  return (
    <Button
      id={id}
      href={href}
      size="medium"
      className="inline-flex items-center gap-2"
    >
      Get Started
      <MdArrowForward className="text-2xl" />
    </Button>
  )
}

export default function KeyFeatures() {
  return (
    <section className="box-content max-w-screen-xl mx-auto pt-24 px-4 md:px-8 lg:px-24">
      <MarketingH3 className="text-center mb-4 !text-4xl md:!text-5xl">
        Essential free features
      </MarketingH3>
      <Body1 className="text-center">
        Save time and cut costs with free campaign software.
      </Body1>
      <div className="pt-16 grid grid-cols-1 md:grid-cols-12 gap-6">
        <CardWrapper className="pt-8 md:pt-12 pb-0 col-span-12 md:col-span-5 flex flex-col">
          <hgroup>
            <MarketingH4 className="mb-4">
              Create winning content in seconds
            </MarketingH4>
            <Body1 className="mb-8">
              Save time and multiply your campaign&apos;s output with AI trained
              on dozens of carefully honed templates, from press releases to
              endorsement pitches.
            </Body1>
          </hgroup>
          <div className="pb-10">
            <CTALink id="tools-winning-content" />
          </div>
          <Image src={contentImg} alt="content" className="mt-auto" />
        </CardWrapper>

        <CardWrapper className="col-span-12 md:col-span-7">
          <Image src={trackerImg} alt="content" className="mt-0 md:mt-8" />
          <hgroup>
            <MarketingH4 className="mt-6 mb-4">
              Run a data-driven campaign
            </MarketingH4>
            <Body1 className="mb-8">
              Get custom data for your race in minutes to level up your outreach
              efforts and understand what motivates your voters.
            </Body1>
          </hgroup>
          <CTALink id="tools-data-campaign" href="/login" />
        </CardWrapper>

        <CardWrapper className="col-span-12 md:col-span-7">
          <Image
            src={expertsImg}
            alt="content"
            className="mt-0 md:mt-10 mb-8"
          />
          <hgroup>
            <MarketingH4 className="mb-4">
              Access to real campaign experts
            </MarketingH4>
            <Body1 className="mb-8">
              Get 1:1 support and advice from our campaign experts, whether
              you&apos;re running for town council or Congress.
            </Body1>
          </hgroup>
          <CTALink id="tools-access-experts" />
        </CardWrapper>
        <div className="col-span-12 md:col-span-5">
          <CardWrapper className="mb-6">
            <Image src={mapImg} alt="content" className="mb-8" />
            <hgroup>
              <MarketingH4 className="mb-4">
                Devoted volunteer network
              </MarketingH4>
              <Body1 className="mb-8">
                Tap into our movement of 1,000+ remote volunteers eager to help
                power your path to victory.
              </Body1>
            </hgroup>
            <CTALink id="tools-volunteer-network" />
          </CardWrapper>
          <CardWrapper>
            <hgroup>
              <MarketingH4 className="mb-4">
                Dedicated resource library{' '}
              </MarketingH4>
              <Body1 className="mb-8">
                A carefully curated library of the most proven resources to help
                you become a viable candidate.
              </Body1>
            </hgroup>
            <CTALink id="tools-resource-library" />
          </CardWrapper>
        </div>
      </div>
    </section>
  )
}
