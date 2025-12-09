'use client'
import { Button } from 'goodparty-styleguide'
import Link from 'next/link'
import { LuMoveRight } from 'react-icons/lu'

export default function GetStartedButton() {
  return (
    <div className="mt-12 w-full md:w-auto">
      <Link href="/polls/onboarding/loading-insights">
        <Button
          size="large"
          variant="secondary"
          className="w-full bg-blue-500 hover:bg-blue-600 border-blue-500 text-white font-normal"
        >
          Let&apos;s get started <LuMoveRight />
        </Button>
      </Link>
    </div>
  )
}
