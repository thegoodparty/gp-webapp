'use client'
import WandAnimation from '@shared/animations/WandAnimation'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import Body1 from '@shared/typography/Body1'
import H3 from '@shared/typography/H3'
import Paper from '@shared/utils/Paper'
import Link from 'next/link'

export default function EmptyState({ campaign }) {
  const { office, otherOffice } = campaign?.details || {}
  const resolvedOffice = office === 'Other' ? otherOffice : office
  return (
    <Paper>
      <div className="p-4 md:py-8 lg:py-12 flex items-center justify-center">
        <div className="flex flex-col items-center text-center ">
          <div className="h-24 w-24">
            <WandAnimation loop />
          </div>
          <H3 className="mt-4">
            We&apos;re currently gathering the necessary data for{' '}
            <strong>{resolvedOffice}.</strong>
          </H3>
          <Body1 className="mt-4">
            Please check back soon, and we&apos;ll have the information ready
            for you. It takes up to 72 hours.
            <br />
            If you need assistance in the meantime, feel free to contact our
            support team.
          </Body1>
          <Link href="/contact">
            <PrimaryButton className="mt-8">Contact Us</PrimaryButton>
          </Link>
        </div>
      </div>
    </Paper>
  )
}
