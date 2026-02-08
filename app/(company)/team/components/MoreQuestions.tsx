import Image from 'next/image'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import SecondaryButton from '@shared/buttons/SecondaryButton'
import Link from 'next/link'
import MaxWidth from '@shared/layouts/MaxWidth'

const MoreQuestions = (): React.JSX.Element => (
  <MaxWidth>
    <section className="mx-auto mt-4 mb-16 max-w-[616px]">
      <Image
        className="mb-4 w-[100px] h-[82px] mx-auto"
        src="/images/logo/heart.svg"
        width={136}
        height={112}
        alt="GoodParty Logo"
        priority
      />
      <h2 className="text-center text-4xl font-medium leading-tight mb-12">
        More questions about GoodParty.org?
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <Link className="col-span-2 md:col-span-1" href="/faqs">
          <PrimaryButton className="w-full">Visit our FAQ</PrimaryButton>
        </Link>
        <Link className="col-span-2 md:col-span-1" href="/info-session">
          <SecondaryButton className="bg-tertiary text-tertiary-contrast border-none w-full">
            Book an info session
          </SecondaryButton>
        </Link>
      </div>
    </section>
  </MaxWidth>
)

export default MoreQuestions







