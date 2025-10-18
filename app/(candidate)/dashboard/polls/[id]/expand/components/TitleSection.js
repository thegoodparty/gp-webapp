'use client'

import H1 from '@shared/typography/H1'
import Body1 from '@shared/typography/Body1'

export default function TitleSection() {
  return (
    <section>
      <H1 className="text-center">
        How many more messages would you like to send?
      </H1>
      <Body1 className="text-center mt-4 text-muted-foreground">
        We won&apos;t send text messages to constituents you&apos;ve already
        messaged.
      </Body1>
    </section>
  )
}
