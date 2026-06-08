'use client'
import { Button } from '@styleguide'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCandidateProfileForm } from '../useCandidateProfileForm'
import CandidateProfileFields from './CandidateProfileFields'

export default function CandidateProfile(): React.JSX.Element {
  const router = useRouter()
  const form = useCandidateProfileForm({
    onSaved: () => router.push('/dashboard/profile'),
  })

  return (
    <div className="flex h-screen flex-col items-center justify-between pt-2 md:pt-4">
      <div className="mx-auto w-full max-w-2xl p-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard/profile" aria-label="Back to profile">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <div className="font-medium md:text-xl">Candidate profile</div>
          <div>&nbsp;</div>
        </div>

        <div className="mt-10">
          <CandidateProfileFields form={form} />
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-2xl justify-end p-4 md:p-8">
        <Button
          variant="secondary"
          type="button"
          onClick={() => void form.handleSubmit()}
          loading={form.submitting}
          loadingText="Submitting"
        >
          Submit
        </Button>
      </div>
    </div>
  )
}
