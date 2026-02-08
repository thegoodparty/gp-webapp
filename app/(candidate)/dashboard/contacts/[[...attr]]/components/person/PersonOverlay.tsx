'use client'
import { Sheet, SheetContent, SheetTitle } from 'goodparty-styleguide'
import { useContactsTable } from '../../hooks/ContactsTableProvider'
import InfoSection from './InfoSection'
import PersonMap from './PersonMap'

type PersonRecord = Record<string, unknown>

interface Field {
  key: string
  label: string
  transform?: (
    value: string | number | boolean | object | null | unknown,
    person: PersonRecord,
  ) => string | null
  allowCopy?: boolean
}

interface Section {
  title: string
  fields: Field[]
}

const sections: Section[] = [
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

export default function PersonOverlay(): React.JSX.Element {
  const {
    currentlySelectedPerson,
    selectPerson,
    isLoadingPerson,
    isErrorPerson,
    currentlySelectedPersonId,
  } = useContactsTable()

  const handleClose = (open: boolean) => {
    if (!open) {
      selectPerson(null)
    }
  }

  const firstNameValue = currentlySelectedPerson?.firstName
  const lastNameValue = currentlySelectedPerson?.lastName
  const firstName = typeof firstNameValue === 'string' ? firstNameValue : ''
  const lastName = typeof lastNameValue === 'string' ? lastNameValue : ''
  const name = `${firstName} ${lastName}`.trim()

  const shouldShowOverlay = !!currentlySelectedPersonId

  return (
    <Sheet open={shouldShowOverlay} onOpenChange={handleClose}>
      <SheetTitle className="sr-only" aria-describedby="Contact Information">
        <span id="contact-information-title">Contact Information</span>
      </SheetTitle>
      <SheetContent className="w-[90vw] max-w-xl sm:max-w-xl h-full overflow-y-auto z-[1301]">
        <div className="p-4">
          {isErrorPerson ? (
            <div className="flex flex-col items-center justify-center h-full">
              <h2 className="text-2xl font-semibold mb-4">
                Error Loading Contact
              </h2>
              <p className="text-muted-foreground mb-4">
                We couldn&apos;t load this person&apos;s information. Please try
                again.
              </p>
              <button
                onClick={() => selectPerson(null)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                Close
              </button>
            </div>
          ) : isLoadingPerson ? (
            <div>
              <div className="h-12 bg-gray-200 rounded animate-pulse mb-4 w-3/4"></div>
              <div className="py-4 border-b border-gray-200">
                <div className="h-10 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
              {sections.map((section) => (
                <section key={section.title} className="mt-8">
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3 mb-4"></div>
                  {section.fields.map((field) => (
                    <div key={field.key} className="mt-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
                    </div>
                  ))}
                </section>
              ))}
            </div>
          ) : (
            currentlySelectedPerson && (
              <div>
                <h2 className="text-3xl font-semibold lg:text-4xl py-4 border-b border-gray-200">
                  {name || 'Contact'}
                </h2>
                {sections.map((section) => (
                  <InfoSection key={section.title} section={section} />
                ))}
              </div>
            )
          )}
        </div>
        {currentlySelectedPerson && !isErrorPerson && <PersonMap />}
      </SheetContent>
    </Sheet>
  )
}
