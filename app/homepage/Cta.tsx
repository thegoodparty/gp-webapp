'use client'
import MaxWidth from '@shared/layouts/MaxWidth'
import Button from '@shared/buttons/Button'

export default function Cta(): React.JSX.Element {
  return (
    <section className="bg-cream">
      <MaxWidth>
        <div className="flex items-center text-center flex-col w-full pb-20 pt-12">
          <h2 className="font-semibold text-4xl mb-12">
            Run and win...
            <br />
            without a party.
          </h2>
          <div>
            <Button href="/sign-up" id="prefooter_get_started" size="large">
              <span className="tracking-wide">Get started</span>
            </Button>
          </div>
        </div>
      </MaxWidth>
    </section>
  )
}
