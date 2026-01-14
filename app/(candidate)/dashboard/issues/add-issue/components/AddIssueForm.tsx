'use client'

import Button from '@shared/buttons/Button'
import RenderInputField from '@shared/inputs/RenderInputField'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { useRouter } from 'next/navigation'
import { useState, FormEvent } from 'react'
import { ISSUE_STATUSES } from '../../shared/constants'

type FieldKey = 'title' | 'description' | 'location' | 'channel'

interface Field {
  type: string
  label: string
  key: FieldKey
  required?: boolean
  placeholder?: string
  multiline?: boolean
  rows?: number
  options?: string[]
}

const fields: Field[] = [
  {
    type: 'text',
    label: 'IssueTitle',
    key: 'title',
    required: true,
    placeholder: 'Brief, descriptive title of the issue',
  },
  {
    type: 'text',
    multiline: true,
    rows: 4,
    label: 'Description',
    key: 'description',
    required: true,
    placeholder:
      'Provide details about the issue, including when it stared, who is affected, and any relevant context',
  },
  {
    type: 'text',
    label: 'Location',
    key: 'location',
    placeholder: 'Street address, intersection, or general area (optional)',
  },
  {
    type: 'select',
    label: 'Submission Channel',
    key: 'channel',
    required: true,
    options: [
      'In-person Meeting',
      'Phone Call',
      'Email',
      'Social Media',
      'Letter/Mail',
      'Other',
    ],
  },
]

const mapChannelToValue: Partial<Record<string, string>> = {
  'In-person Meeting': 'inPersonMeeting',
  'Phone Call': 'phoneCall',
  Email: 'email',
  'Social Media': 'socialMedia',
  'Letter/Mail': 'letterMail',
  Other: 'other',
}

interface FormState {
  title: string
  description: string
  location: string
  channel: string
}

export default function AddIssueForm(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [state, setState] = useState<FormState>({
    title: '',
    description: '',
    location: '',
    channel: '',
  })
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const resp = await clientFetch(apiRoutes.issues.create, {
      title: state.title,
      description: state.description,
      location: state.location,
      channel: mapChannelToValue[state.channel],
      status: ISSUE_STATUSES.ACCEPTED,
    })
    setIsLoading(false)
    if (resp.ok) {
      router.push('/dashboard/issues')
    }
  }

  const onChangeField = (key: string, val: string | boolean) => {
    setState({
      ...state,
      [key]: String(val),
    })
  }

  const isDisabled =
    state.title === '' ||
    state.description === '' ||
    state.channel === '' ||
    isLoading

  return (
    <form onSubmit={handleSubmit}>
      <div className="my-2" />
      {fields.map((field) => (
        <div key={field.key} className="mb-8">
          <RenderInputField
            field={field}
            value={state[field.key]}
            onChangeCallback={onChangeField}
          />
        </div>
      ))}

      <div className="flex justify-end">
        <Button
          type="submit"
          className="mt-8"
          color="info"
          disabled={isDisabled}
          loading={isLoading}
        >
          Submit Issue
        </Button>
      </div>
    </form>
  )
}
