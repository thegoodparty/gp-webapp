'use client'
import { Sheet, SheetContent } from 'goodparty-styleguide'
import { usePerson } from '../PersonProvider'
import { useRouter } from 'next/navigation'
import InfoSection from './InfoSection'

const sections = [
  {
    title: 'General Information',
    fields: [
      // gender, age, political part, district
      {
        key: 'Voters_Gender',
        label: 'Gender',
        transform: (value) => {
          if (!value) return 'N/A'
          return value === 'M' ? 'Male' : 'Female'
        },
      },
      {
        key: 'Voters_Age',
        label: 'Age',
      },
      {
        key: 'Parties_Description',
        label: 'Political Party',
      },
    ],
  },
]

export default function PersonOverlay() {
  const [person, setPerson] = usePerson()
  const router = useRouter()

  const handleClose = (open) => {
    if (!open) {
      setPerson(null)
      router.push('/dashboard/people')
    }
  }
  const name = `${person?.Voters_FirstName} ${person?.Voters_LastName}`

  return (
    <Sheet open={!!person} onOpenChange={handleClose}>
      <SheetContent className="w-[90vw] max-w-3xl sm:max-w-3xl h-full overflow-y-auto">
        <div className="p-4">
          {person && (
            <div>
              <h2 className="text-3xl font-semibold lg:text-4xl py-4 border-b border-gray-200">
                {name}
              </h2>
              {sections.map((section) => (
                <InfoSection key={section.title} section={section} />
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
