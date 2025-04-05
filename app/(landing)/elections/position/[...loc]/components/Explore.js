import MaxWidth from '@shared/layouts/MaxWidth'
import SearchLocation from 'app/(landing)/elections/shared/SearchLocation'
import Image from 'next/image'

export default function Explore() {
  return (
    <section className="pb-20">
      <MaxWidth>
        <div className="flex mt-40 items-start">
          <h2 className="pr-2 text-5xl md:text-8xl font-semibold">
            Explore elections in your community
          </h2>
          <Image
            src="/images/logo/heart.svg"
            alt="GoodParty"
            width={200}
            height={200}
          />
        </div>
        <h3 className="mt-24 mb-12 font-semibold text-2xl">
          Find elections at the State, County or City level
        </h3>
        <SearchLocation />
      </MaxWidth>
    </section>
  )
}
