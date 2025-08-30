'use client'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from 'goodparty-styleguide'
import { usePerson } from '../PersonProvider'
import { useRouter } from 'next/navigation'

export default function PersonOverlay() {
  const [person, setPerson] = usePerson()
  const router = useRouter()

  const handleClose = (open) => {
    if (!open) {
      setPerson(null)
      router.push('/dashboard/people')
    }
  }

  return (
    <Sheet open={!!person} onOpenChange={handleClose}>
      <SheetContent className="w-[90vw] max-w-3xl sm:max-w-3xl">
        <SheetHeader>
          <SheetTitle>Person Details</SheetTitle>
        </SheetHeader>
        <div className="p-4">
          {person && (
            <div>
              <h3>Person Information</h3>
              <pre>{JSON.stringify(person, null, 2)}</pre>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
