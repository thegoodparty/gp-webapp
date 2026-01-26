'use client'
import { Sheet, SheetContent } from 'goodparty-styleguide'
import { usePerson } from '../../hooks/PersonProvider'
import { useRouter } from 'next/navigation'
import InfoSection from './InfoSection'
import PersonMap from './PersonMap'
import { useSearchParams } from 'next/navigation'
import type { ComponentProps } from 'react'

type InfoSectionProps = ComponentProps<typeof InfoSection>

const sections: InfoSectionProps['section'][] = [
  {
    title: 'General Information',
    fields: [
      {
        key: 'gender',
        label: 'Gender',
        transform: (value) => (value ? String(value) : 'N/A'),
      },
      {
        key: 'age',
        label: 'Age',
        transform: (value) => (value ? `${value} years old` : 'N/A'),
      },
      {
        key: 'politicalParty',
        label: 'Political Party',
        transform: (value) => (value ? String(value) : 'N/A'),
      },
      {
        key: 'maritalStatus',
        label: 'Marital Status',
        transform: (value) => (value ? String(value) : 'Unknown'),
      },
      {
        key: 'ethnicityGroup',
        label: 'Ethnicity',
        transform: (value) => (value ? String(value) : 'Unknown'),
      },
    ],
  },
  {
    title: 'Contact Information',
    fields: [
      {
        key: 'address',
        label: 'Address',
        transform: (value) => (value ? String(value) : 'N/A'),
        allowCopy: true,
      },
      {
        key: 'cellPhone',
        label: 'Cell Phone Number',
        transform: (value) => (value ? String(value) : 'Unknown'),
        allowCopy: true,
      },
      {
        key: 'landline',
        label: 'Landline',
        transform: (value) => (value ? String(value) : 'Unknown'),
        allowCopy: true,
      },
    ],
  },
  {
    title: 'Voter Demographics',
    fields: [
      {
        key: 'activeVoter',
        label: 'Active Voter',
        transform: (value) => (value ? String(value) : 'Unknown'),
      },
      {
        key: 'voterStatus',
        label: 'Voter Status',
        transform: (value) => (value ? String(value) : 'Unknown'),
      },
    ],
  },
  {
    title: 'Additional Information',
    fields: [
      {
        key: 'hasChildrenUnder18',
        label: 'Has Children Under 18',
        transform: (value) => (value ? String(value) : 'Unknown'),
      },
      {
        key: 'veteranStatus',
        label: 'Veteran Status',
        transform: (value) => (value ? String(value) : 'Unknown'),
      },
      {
        key: 'homeowner',
        label: 'Homeowner',
        transform: (value) => (value ? String(value) : 'Unknown'),
      },
      {
        key: 'businessOwner',
        label: 'Business Owner',
        transform: (value) => (value ? String(value) : 'Unknown'),
      },
      {
        key: 'levelOfEducation',
        label: 'Education Level',
        transform: (value) => (value ? String(value) : 'Unknown'),
      },
      {
        key: 'language',
        label: 'Language',
        transform: (value) => (value ? String(value) : 'Unknown'),
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

const PersonOverlay = (): React.JSX.Element => {
  const [person, setPerson] = usePerson()
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleClose = (open: boolean) => {
    if (!open) {
      setPerson(null)
      const queryString = searchParams!.toString()
      router.push(`/dashboard/contacts${queryString ? `?${queryString}` : ''}`)
    }
  }
  const { firstName, lastName } = person || {}
  const name = `${firstName} ${lastName}`

  return (
    <Sheet open={!!person} onOpenChange={handleClose}>
      <SheetContent
        className="
          w-[90vw]
          max-w-xl
          sm:max-w-xl
          h-full
          overflow-y-auto
          z-[1301]
        "
      >
        <div className="p-4">
          {person && (
            <div>
              <h2
                className="
                  text-3xl
                  font-semibold
                  lg:text-4xl
                  py-4
                  border-b
                  border-gray-200
                "
              >
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

export default PersonOverlay
