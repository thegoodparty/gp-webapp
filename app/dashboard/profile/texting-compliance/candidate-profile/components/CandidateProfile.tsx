import { Button, Textarea } from '@styleguide'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function CandidateProfile(): React.JSX.Element {
  return (
    <div className="flex flex-col h-screen justify-between items-center pt-2 md:pt-4">
      <div className="max-w-2xl mx-auto p-4 w-full">
        <div className="flex items-center justify-between">
          <Link href="/dashboard/profile">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div className="md:text-xl">CandidateProfile</div>
          <div>&nbsp;</div>
        </div>

        <div className="mt-10">
          <label htmlFor="why">Why are you running?</label>
          <Textarea id="why" />
          <p className="text-sm text-muted-foreground">500 character minimum</p>
        </div>
      </div>
      <div className="max-w-2xl mx-auto p-4 md:p-8 flex justify-end w-full">
        <Button variant="secondary" type="submit">
          Submit
        </Button>
      </div>
    </div>
  )
}
