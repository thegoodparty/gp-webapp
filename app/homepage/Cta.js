'use client'
import MaxWidth from '@shared/layouts/MaxWidth'
import Button from '@shared/buttons/Button'

export default function Cta() {
  return (
    <MaxWidth>
      <div className="flex items-center text-center flex-col w-full pb-20 pt-12">
        <h3 className="font-semibold text-4xl mb-12">
          Any questions? Schedule a demo with our team
        </h3>
        <div>
          <Button
            href="/get-a-demo"
            id="prefooter_demo"
            variant="outlined"
            size="large"
            className="font-bold !rounded-full w-48"
          >
            <span className="tracking-wide">GET A DEMO</span>
          </Button>
        </div>
      </div>
    </MaxWidth>
  )
}
