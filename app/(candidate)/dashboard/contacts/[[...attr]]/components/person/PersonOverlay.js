'use client'
import { Sheet, SheetContent } from 'goodparty-styleguide'
import { usePerson } from '../../hooks/PersonProvider'
import { useRouter } from 'next/navigation'
import InfoSection from './InfoSection'
import PersonMap from './PersonMap'
import { useSearchParams } from 'next/navigation'

const sections = [
  {
    title: 'General Information',
    fields: [
      {
        key: 'gender',
        label: 'Gender',
        transform: (value) => value || 'N/A',
      },
      {
        key: 'age',
        label: 'Age',
        transform: (value) => (value ? `${value} years old` : 'N/A'),
      },
      {
        key: 'politicalParty',
        label: 'Political Party',
        transform: (value) => value || 'N/A',
      },
      {
        key: 'maritalStatus',
        label: 'Marital Status',
        transform: (value) => value || 'Unknown',
      },
      {
        key: 'ethnicityGroup',
        label: 'Ethnicity',
        transform: (value) => value || 'Unknown',
      },
    ],
  },
  {
    title: 'Contact Information',
    fields: [
      {
        key: 'address',
        label: 'Address',
        transform: (value) => value || 'N/A',
        allowCopy: true,
      },
      {
        key: 'cellPhone',
        label: 'Cell Phone Number',
        transform: (value) =>
          value && value !== 'Unknown' ? (
            <a
              href={`tel:${value.replace(/\D/g, '')}`}
              className="text-blue-600 hover:underline"
            >
              {value}
            </a>
          ) : (
            'Unknown'
          ),
        allowCopy: true,
      },
      {
        key: 'landline',
        label: 'Landline',
        transform: (value) =>
          value && value !== 'Unknown' ? (
            <a
              href={`tel:${value.replace(/\D/g, '')}`}
              className="text-blue-600 hover:underline"
            >
              {value}
            </a>
          ) : (
            'Unknown'
          ),
        allowCopy: true,
      },
    ],
  },
  {
    title: 'Voter Demographics',
    fields: [
      {
        key: 'registeredVoter',
        label: 'Registered Voter',
        transform: (value) => value || 'Unknown',
      },
      {
        key: 'activeVoter',
        label: 'Active Voter',
        transform: (value) => value || 'Unknown',
      },
      {
        key: 'voterStatus',
        label: 'Voter Status',
        transform: (value) => value || 'Unknown',
      },
    ],
  },
  {
    title: 'Additional Information',
    fields: [
      {
        key: 'hasChildrenUnder18',
        label: 'Has Children Under 18',
        transform: (value) => value || 'Unknown',
      },
      {
        key: 'veteranStatus',
        label: 'Veteran Status',
        transform: (value) => value || 'Unknown',
      },
      {
        key: 'homeowner',
        label: 'Homeowner',
        transform: (value) => value || 'Unknown',
      },
      {
        key: 'businessOwner',
        label: 'Business Owner',
        transform: (value) => value || 'Unknown',
      },
      {
        key: 'levelOfEducation',
        label: 'Education Level',
        transform: (value) => value || 'Unknown',
      },
      {
        key: 'language',
        label: 'Language',
        transform: (value) => value || 'Unknown',
      },
      // uncomment when the data is done loading
      // {
      //   key: 'estimatedIncomeRange',
      //   label: 'Estimated Income Range',
      //   transform: (value) => value || 'Unknown',
      // },
    ],
  },
]

export default function PersonOverlay() {
  const [person, setPerson] = usePerson()
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleClose = (open) => {
    if (!open) {
      setPerson(null)
      const queryString = searchParams.toString()
      router.push(`/dashboard/contacts${queryString ? `?${queryString}` : ''}`)
    }
  }
  const name = `${person?.firstName} ${person?.lastName}`

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
