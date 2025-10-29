'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import CongratulationsAnimation from '@shared/animations/CongratulationsAnimation'

export default function SuccessPage({}) {
  const router = useRouter()

  useEffect(() => {
    trackEvent(EVENTS.ServeOnboarding.SuccessPageViewed)
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.replace('/dashboard/polls')
    }, 4000)
    return () => clearTimeout(timeoutId)
  }, [router])

  return (
    <div className="flex flex-col">
      <main className="flex-1 pb-24 md:pb-0">
        <section className="max-w-screen-md mx-auto p-4 sm:p-8 lg:p-16 bg-white md:border md:border-slate-200 md:rounded-xl md:mt-12">
          <div className="flex flex-col items-center md:justify-center mb-12">
            <div className="relative h-60 w-60 mx-auto">
              <CongratulationsAnimation loop />
            </div>
            <h1 className="text-left md:text-center font-semibold text-2xl md:text-4xl w-full mb-2">
              Your first poll has been scheduled
            </h1>
            <p className="text-left md:text-center mt-4 text-lg font-normal text-muted-foreground mb-2">
              You’ve taken your first step toward shaping the future of your
              community — <br /> and that’s something to be proud of.
            </p>
            <p className="text-left md:text-center mt-4 font-normal text-blue">
              You will be taken to your poll momentarily...
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
