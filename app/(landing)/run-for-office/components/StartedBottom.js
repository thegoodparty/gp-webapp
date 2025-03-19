import Image from 'next/image';
import Button from '@shared/buttons/Button';
import MarketingH3 from '@shared/typography/MarketingH3';
import Body1 from '@shared/typography/Body1';

export default function StartedBottom() {
  return (
    <>
      <div className="bg-[linear-gradient(172deg,_#F7FAFB_54.5%,_#fff_55%)] h-[calc(100vw*.17)] w-full" />
      <section className="bg-white text-center py-12 lg:pb-24">
        <Image
          className="inline mb-6"
          src="/images/logo/heart.svg"
          alt="GoodParty"
          width={136}
          height={111}
        />
        <MarketingH3>Get started</MarketingH3>
        <Body1 className="inline-block m-6 max-w-2xl">
          Try our tools risk free to scale your campaign, or get a demo with one
          of our campaign experts.
        </Body1>
        <div className="p-4">
          <Button
            href="/sign-up"
            id="hero-get-started"
            className="mr-4 mb-4 w-full md:w-auto"
            size="large"
          >
            Get free tools
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
            Interactive demo
          </Button>
        </div>
      </section>
    </>
  );
}
