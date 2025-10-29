'use client'
import { useRouter } from 'next/navigation'
import { Button } from 'goodparty-styleguide'
export default function LossPage({}) {
  const router = useRouter()

  const onComplete = () => {
    router.replace('/dashboard')
  }

  return (
    <div className="flex flex-col">
      <main className="flex-1 pb-24 md:pb-0">
        <section className="max-w-screen-md mx-auto p-4 sm:p-8 lg:p-16 bg-white md:border md:border-slate-200 md:rounded-xl md:mt-12">
          <div className="flex flex-col items-center md:justify-center">
            <h1 className="text-center font-semibold text-2xl md:text-4xl w-full mt-4 md:mt-0">
              Not every campaign wins, but every campaign matters.
            </h1>
            <p className="text-center mt-8 text-lg font-normal text-muted-foreground w-full">
              We&apos;re proud of all you&apos;ve accomplished. If you decide to
              run again, we&apos;ll be ready. Until then, you know where to find
              us!
            </p>

            <Button onClick={onComplete} size="large" className="mt-8">
              Back to Dashboard
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}
