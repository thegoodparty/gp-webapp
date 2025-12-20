'use client'

import PrimaryButton from '@shared/buttons/PrimaryButton'
import RenderInputField from '@shared/inputs/RenderInputField'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, FormEvent } from 'react'
import { flatStates } from 'helpers/statesHelper'
import { URLSearchParamsToObject } from 'helpers/URLSearchParamsToObject'
import Body2 from '@shared/typography/Body2'

interface FormField {
  key: keyof FormState
  label: string
  type: 'select' | 'text' | 'date'
  options?: string[]
  helperText?: string
}

interface FormState {
  state?: string
  slug?: string
  email?: string
  level?: string
  campaignStatus?: string
  p2vStatus?: string
  primaryElectionDateStart?: string
  primaryElectionDateEnd?: string
  generalElectionDateStart?: string
  generalElectionDateEnd?: string
}

interface SearchFormProps {
  show?: boolean
}

const formFields: FormField[] = [
  {
    key: 'state',
    label: 'State',
    type: 'select',
    options: [...flatStates],
  },
  {
    key: 'slug',
    label: 'Campaign Slug',
    type: 'text',
  },
  {
    key: 'email',
    label: 'User Email',
    type: 'text',
    helperText: 'Partial match is accepted',
  },
  {
    key: 'level',
    label: 'Race Level',
    type: 'select',
    options: ['local', 'city', 'county', 'state', 'federal'],
  },
  {
    key: 'campaignStatus',
    label: 'Campaign Status',
    type: 'select',
    options: ['active', 'inactive'],
  },
  {
    key: 'p2vStatus',
    label: 'P2V Status',
    type: 'select',
    options: ['Waiting', 'Complete', 'Failed'],
  },
  {
    key: 'primaryElectionDateStart',
    label: 'Primary Election Date Start',
    type: 'date',
  },
  {
    key: 'primaryElectionDateEnd',
    label: 'Primary Election Date End',
    type: 'date',
  },
  {
    key: 'generalElectionDateStart',
    label: 'General Election Date Start',
    type: 'date',
  },
  {
    key: 'generalElectionDateEnd',
    label: 'General Election Date End',
    type: 'date',
  },
]

export default function SearchForm({
  show = true,
}: SearchFormProps): React.JSX.Element {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formState, setFormState] = useState<FormState>(
    searchParams ? URLSearchParamsToObject(searchParams) : {},
  )

  const onChangeField = (key: string, val: string | boolean) => {
    setFormState({
      ...formState,
      [key]: String(val),
    })
  }

  const {
    primaryElectionDateStart,
    primaryElectionDateEnd,
    generalElectionDateStart,
    generalElectionDateEnd,
    state,
  } = formState
  const invalidPrimaryDates =
    primaryElectionDateStart !== '' &&
    primaryElectionDateEnd !== '' &&
    new Date(primaryElectionDateStart || '') >
      new Date(primaryElectionDateEnd || '')
  const invalidGeneralDates =
    generalElectionDateStart !== '' &&
    generalElectionDateEnd !== '' &&
    new Date(generalElectionDateStart || '') >
      new Date(generalElectionDateEnd || '')
  const invalidState = state && !flatStates.includes(state)
  const noFiltersSet = Object.values(formState).every(
    (val) => val === '' || val === undefined,
  )
  const formValid =
    !(invalidPrimaryDates || invalidGeneralDates || invalidState) ||
    noFiltersSet

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const searchParams = new URLSearchParams()

    const formStateKeys: (keyof FormState)[] = [
      'state',
      'slug',
      'email',
      'level',
      'campaignStatus',
      'p2vStatus',
      'primaryElectionDateStart',
      'primaryElectionDateEnd',
      'generalElectionDateStart',
      'generalElectionDateEnd',
    ]
    formStateKeys.forEach((key) => {
      const value = formState[key]
      if (value !== undefined && value !== '') {
        searchParams.append(key, value)
      }
    })

    router.push(
      noFiltersSet
        ? `?firehose=true`
        : `?${searchParams.toString().replace('firehose=true&', '')}`,
    )
  }

  return (
    <form
      className={`
        mb-4
        overflow-hidden
        transform
        transition-all
        ${show ? 'max-h-screen' : 'max-h-0'}
      `}
      noValidate
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-12 gap-4 mt-6">
        {formFields.map((field) => (
          <div
            key={field.key}
            className={`
              mb-3
              col-span-12
              md:col-span-6
              lg:col-span-3
              ${field.type === 'select' ? 'mt-0' : 'mt-5'}
            `}
          >
            <RenderInputField
              field={field}
              value={formState[field.key] || ''}
              onChangeCallback={onChangeField}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <div className="text-right">
          <PrimaryButton type="submit" disabled={!formValid}>
            Search
          </PrimaryButton>
          <Body2 className="mt-2">
            If you search without any filters, all campaigns will be returned.
          </Body2>
        </div>
      </div>
    </form>
  )
}
