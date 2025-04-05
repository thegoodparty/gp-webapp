import WarningButton from '@shared/buttons/WarningButton'
import Image from 'next/image'
import Link from 'next/link'

export default function CtaBanner({ race }) {
  const { normalizedPositionName } = race
  return (
    <section className="py-12 relative">
      <div className="absolute h-1/2 w-full top-1/2 bg-primary-dark"></div>
      <div className="max-w-screen-xl mx-auto">
        <div className=" bg-[#F7FCFF] p-12 grid grid-cols-12 gap-6 items-center rounded-3xl relative z-10">
          <div className=" col-span-12 md:col-span-3 lg:col-span-2">
            <Image
              src="/images/logo/heart.svg"
              alt="GoodParty"
              width={200}
              height={200}
            />
          </div>
          <div className=" col-span-12 md:col-span-6 lg:col-span-8">
            <div className="px-3">
              <h3 className="font-medium text-3xl" id="cta-header">
                Running for {normalizedPositionName}?
              </h3>
              <div className="mt-4 text-xl" id="cta-body">
                Explore free campaign tools and training.
              </div>
            </div>
          </div>
          <div className=" col-span-12 md:col-span-3 lg:col-span-2">
            <Link href="/run-for-office">
              <WarningButton fullWidth>Learn more</WarningButton>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
