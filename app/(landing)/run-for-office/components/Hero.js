import Image from 'next/image'
import Body1 from '@shared/typography/Body1'
import MarketingH2 from '@shared/typography/MarketingH2'
import heroImg from 'public/images/run-for-office/run-hero.png'
import Button from '@shared/buttons/Button'

export default function Hero() {
  return (
    <section className="box-content max-w-screen-xl mx-auto py-16 px-4 md:px-8 lg:px-24 sm:flex flex-col md:grid grid-cols-12 gap-x-4 items-center">
      <div className="max-w-lg pb-10 md:pb-8 col-span-6">
        <MarketingH2
          asH1
          className="text-5xl !leading-snug !font-semibold mb-6"
        >
          Supercharge your local campaign
        </MarketingH2>
        <Body1>
          GoodParty.org empowers grassroots candidates to run viable campaigns
          with free tech, data, and support.
        </Body1>
        <div className="mt-8">
          <Button
            href="/sign-up"
            id="hero-get-started"
            className="mr-4 mb-4 w-full md:w-auto"
            size="large"
          >
            Get Started
          </Button>
          {/*This needs to be an anchor tag to force a page load for the
            Product Tour page, to ensure the main nav doesn't render twice.*/}
          <Button
            nativeLink
            href="/product-tour"
            id="hero-demo"
            className="w-full md:w-auto"
            size="large"
            variant="outlined"
          >
            Book a free demo
          </Button>
        </div>
      </div>
      <div className="grow md:text-right col-span-6">
        <Image
          src={heroImg}
          className="max-w-xl w-full inline"
          alt="run for office"
          priority
          full
        />
      </div>
    </section>
  )
}
