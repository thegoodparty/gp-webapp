'use client'
import { Sheet, SheetContent } from 'goodparty-styleguide'
import { usePerson } from '../../hooks/PersonProvider'
import { useRouter } from 'next/navigation'
import InfoSection from './InfoSection'
import PersonMap from './PersonMap'

const sections = [
  {
    title: 'General Information',
    fields: [
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
        transform: (value) => (value ? `${value} years old` : 'N/A'),
      },
      {
        key: 'Parties_Description',
        label: 'Political Party',
        transform: (value) => (value === 'Non-Partisan' ? 'Democrat' : value),
      },
    ],
  },
  {
    title: 'Contact Information',
    fields: [
      {
        key: 'Residence_Addresses_AddressLine',
        label: 'Address',
        transform: (value, person) => {
          const parts = []
          if (value) parts.push(value)
          if (person.Residence_Addresses_City)
            parts.push(person.Residence_Addresses_City)
          if (person.Residence_Addresses_State)
            parts.push(person.Residence_Addresses_State)
          if (person.Residence_Addresses_Zip)
            parts.push(person.Residence_Addresses_Zip)
          return parts.length > 0 ? parts.join(', ') : 'N/A'
        },
      },
      {
        key: 'VoterTelephones_CellPhoneFormatted',
        label: 'Cell Phone Number',
        transform: (value) =>
          value ? (
            <a
              href={`tel:${value.replace(/\D/g, '')}`}
              className="text-blue-600 hover:underline"
            >
              {value}
            </a>
          ) : (
            'N/A'
          ),
      },
      {
        key: 'VoterTelephones_LandlineFormatted',
        label: 'Landline',
        transform: (value) => value || 'Unknown',
      },
    ],
  },
  {
    title: 'Voter Demographics',
    fields: [
      {
        key: 'LALVOTERID',
        label: 'Registered Voter',
        transform: (value) => (value ? 'Yes' : 'No'),
      },
      {
        key: 'Voters_VotingPerformanceEvenYearGeneral',
        label: 'Active Voter',
        transform: (value) => (value === 'Not Eligible' ? 'No' : 'Yes'),
      },
      {
        key: 'Voters_VotingPerformanceEvenYearGeneral',
        label: 'Voter Status',
        transform: (value) => (value === 'Not Eligible' ? 'First Time' : value),
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
      <SheetContent className="w-[90vw] max-w-xl sm:max-w-xl h-full overflow-y-auto z-[1301]">
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
        <PersonMap />
      </SheetContent>
    </Sheet>
  )
}
