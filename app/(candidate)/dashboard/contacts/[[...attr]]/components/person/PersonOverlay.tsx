'use client'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Sheet,
  SheetContent,
  SheetTitle,
} from 'goodparty-styleguide'
import { LuClipboardList, LuContact, LuFolderOpen } from 'react-icons/lu'
import { useContactsTable } from '../../hooks/ContactsTableProvider'
import { Person } from '../shared/ajaxActions'
import { isNotNil } from 'es-toolkit'
import { ReactNode } from 'react'
import Map from '@shared/utils/Map'

export const formatPersonName = (person: Person) =>
  [person.firstName, person.lastName, person.nameSuffix]
    .filter(Boolean)
    .map((n) => n!.trim())
    .join(' ')

const InfoSection: React.FC<{
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}> = ({ title, icon, children }) => (
  <Card className="p-6">
    <div className="flex items-center justify-between">
      <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      {icon}
    </div>
    <div className="flex flex-col gap-4">{children}</div>
  </Card>
)

const Field: React.FC<{ label: string; value: ReactNode | string | null }> = ({
  label,
  value,
}) => (
  <div className="flex flex-col gap-1">
    <p className="text-sm text-muted-foreground">{label}</p>
    <div className="text-md">{value ?? 'Unknown'}</div>
  </div>
)

const INCOME_BUCKETS = [
  { label: 'Less than $1k', min: 0, max: 1000 },
  { label: '$1k - $15k', min: 1000, max: 15000 },
  { label: '$15k - $25k', min: 15000, max: 25000 },
  { label: '$25k - $35k', min: 25000, max: 35000 },
  { label: '$35k - $50k', min: 35000, max: 50000 },
  { label: '$50k - $75k', min: 50000, max: 75000 },
  { label: '$75k - $100k', min: 75000, max: 100000 },
  { label: '$100k - $125k', min: 100000, max: 125000 },
  { label: '$125k - $150k', min: 125000, max: 150000 },
  { label: '$150k - $175k', min: 150000, max: 175000 },
  { label: '$175k - $200k', min: 175000, max: 200000 },
  { label: '$200k - $250k', min: 200000, max: 250000 },
  { label: '$250k+', min: 250000, max: Infinity },
]

const getIncomeBucket = (income: number | null) => {
  if (!income) return null
  return (
    INCOME_BUCKETS.find(
      (bucket) => income >= bucket.min && income <= bucket.max,
    ) ?? null
  )
}

const PersonContent: React.FC<{
  person: Person
  hidePoliticalParty: boolean
}> = ({ person, hidePoliticalParty }) => {
  const details = [person.gender, person.age ? `${person.age} years old` : null]
    .filter(isNotNil)
    .join(', ')

  return (
    <div>
      <h2 className="text-3xl font-semibold py-4">
        {formatPersonName(person)}
      </h2>
      <p className="text-xl font-semibold mb-4">{details}</p>
      <div className="flex flex-col gap-6">
        <InfoSection title="Contact Information" icon={<LuContact size={24} />}>
          <Field
            label="Address"
            value={
              <>
                <p>{person.address.line1}</p>
                {person.address.line2 && <p>{person.address.line2}</p>}
                <p>
                  {person.address.city}, {person.address.state}{' '}
                  {person.address.zip}
                </p>
              </>
            }
          />
          {person.address.latitude && person.address.longitude && (
            <Map
              places={[
                {
                  lat: person.address.latitude,
                  lng: person.address.longitude,
                  title: formatPersonName(person),
                  description: [
                    person.address.line1,
                    person.address.line2,
                    person.address.city,
                    person.address.state,
                    person.address.zip,
                  ]
                    .filter(isNotNil)
                    .join(', '),
                },
              ]}
              height="200px"
            />
          )}
          <Field label="Cell Phone Number" value={person.cellPhone} />
          <Field label="Landline" value={person.landline} />
        </InfoSection>
        <InfoSection
          title="Voter Demographics"
          icon={<LuClipboardList size={24} />}
        >
          <Field label="Registered Voter" value={person.registeredVoter} />
          <Field label="Voter Status" value={person.voterStatus} />
          {!hidePoliticalParty && (
            <Field label="Political Party" value={person.politicalParty} />
          )}
        </InfoSection>

        <InfoSection
          title="Demographic Information"
          icon={<LuFolderOpen size={24} />}
        >
          <Field label="Marital Status" value={person.maritalStatus} />
          <Field
            label="Has Children Under 18"
            value={person.hasChildrenUnder18}
          />
          <Field label="Veteran Status" value={person.veteranStatus} />
          <Field label="Homeowner" value={person.homeowner} />
          <Field label="Business Owner" value={person.businessOwner} />
          <Field label="Level of Education" value={person.levelOfEducation} />
          <Field
            label="Estimated Income Range"
            value={getIncomeBucket(person.estimatedIncomeAmount)?.label ?? null}
          />
          <Field label="Language" value={person.language} />
          <Field label="Ethnicity Group" value={person.ethnicityGroup} />
        </InfoSection>
      </div>
    </div>
  )
}

export default function PersonOverlay(): React.JSX.Element {
  const {
    currentlySelectedPerson: person,
    selectPerson,
    isLoadingPerson,
    isErrorPerson,
    currentlySelectedPersonId,
    isElectedOfficial,
  } = useContactsTable()

  const handleClose = (open: boolean) => {
    if (!open) {
      selectPerson(null)
    }
  }
  const shouldShowOverlay = !!currentlySelectedPersonId

  return (
    <Sheet open={shouldShowOverlay} onOpenChange={handleClose}>
      <SheetTitle className="sr-only" aria-describedby="Contact Information">
        <span id="contact-information-title">Contact Information</span>
      </SheetTitle>
      <SheetContent className="w-screen sm:w-[90vw] sm:max-w-xl h-full overflow-y-auto z-[1301]">
        <div className="p-6">
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
              <div className="h-10 bg-gray-200 rounded animate-pulse mb-4 w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-4 w-1/3"></div>
              <div className="flex flex-col gap-6">
                {[4, 2, 10].map((fieldCount, cardIndex) => (
                  <Card key={cardIndex}>
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3"></div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                      {Array.from({ length: fieldCount }).map(
                        (_, fieldIndex) => (
                          <div key={fieldIndex} className="flex flex-col gap-1">
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
                            <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2"></div>
                          </div>
                        ),
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            person && (
              <PersonContent
                person={person}
                hidePoliticalParty={isElectedOfficial}
              />
            )
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
