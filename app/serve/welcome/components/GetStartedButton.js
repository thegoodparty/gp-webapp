'use client'
import { Button } from 'goodparty-styleguide'
import Link from 'next/link'

export default function GetStartedButton() {
  return (
    <div className="mt-12 w-full lg:w-auto">
      <Link href="/serve/loading">
        <Button size="large" className="w-full lg:w-auto">
          Let&apos;s get started
        </Button>
      </Link>
    </div>
  )
}
