import Image from 'next/image'

import votersImg from '/public/images/homepage-jan23/homepage-voters.png'
import PurpleButton from '@shared/buttons/PurpleButton'
import Link from 'next/link'

export default function ForVoters() {
  return (
    <div className="grid grid-cols-12 gap-3 mt-5 lg:mt-32 relative">
      <div className="col-span-12 lg:col-span-8 lg:order-last">
        <div className="min-h-[350px] w-[calc(100vw+80px)] -ml-10 lg:w-auto lg:ml-0 relative">
          <Image
            src={votersImg}
            sizes="100vw"
            fill
            className="object-contain"
            alt=""
            placeholder="blur"
            priority
          />
        </div>
      </div>
      <div className="col-span-12 lg:col-span-4 py-10">
        <h2 className="font-black text-4xl">For Voters</h2>
        <div className="text-lg mt-2">
          Join our movement for a brighter political future. You&apos;ll join a
          community of independent-minded people helping to elect a new
          generation of real people running winning campaigns on good ideas.
        </div>
        <div className="mt-4 lg:flex items-center">
          <Link href="/volunteer">
            <PurpleButton
              className="tracking-wider py-5 px-8"
              id="find-candidates-button"
            >
              Learn More
            </PurpleButton>
          </Link>
        </div>
      </div>
    </div>
  )
}
