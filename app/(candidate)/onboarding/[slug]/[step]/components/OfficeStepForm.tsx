'use client'
import { useUser } from '@shared/hooks/useUser'
import RenderInputField, { FieldConfig } from '@shared/inputs/RenderInputField'
import H1 from '@shared/typography/H1'
import { validateZip } from 'app/(entrance)/sign-up/components/SignUpPage'
import { Fragment, useEffect, useState } from 'react'
import Body2 from '@shared/typography/Body2'

type OfficeStepFieldKey = 'zip' | 'level' | 'fuzzyFilter'

interface OfficeStepField extends FieldConfig {
  key: OfficeStepFieldKey
}

interface OfficeStepFormState {
  zip: string
  level: string
  fuzzyFilter: string
}

interface OfficeStepFormProps {
  onChange: (state: OfficeStepFormState) => void
  level?: string
  zip?: string
  adminMode?: boolean
}

const fields: OfficeStepField[] = [
  {
    key: 'zip',
    label: 'Zip Code',
    type: 'number',
    required: true,
    dataAttributes: {
      'data-amplitude-unmask': 'true'
    },
  },
  {
    key: 'level',
    label: 'Office Level',
    type: 'select',
    options: ['Local/Township/City', 'County/Regional', 'State', 'Federal'],
    dataAttributes: {
      'data-amplitude-unmask': 'true'
    },
  },
  {
    key: 'fuzzyFilter',
    label: 'Office Name',
    type: 'text',
    dataAttributes: {
      'data-amplitude-unmask': 'true'
    },
  },
]

export default function OfficeStepForm({ onChange, level, zip, adminMode }: OfficeStepFormProps): React.JSX.Element {
  const [state, setState] = useState<OfficeStepFormState>({
    zip: zip || '',
    level: level || '',
    fuzzyFilter: '',
  })
  const [user] = useUser()

  const canSubmit = state.zip && validateZip(state.zip)

  useEffect(() => {
    canSubmit && onChange({ ...state })
  }, [state])

  const onChangeField = (key: string, value: string | boolean) => {
    setState({
      ...state,
      [key]: value,
    })
  }

  return (
    <>
      <H1 className="text-center">
        Welcome, {adminMode ? '' : user?.firstName || ''}
        <br />
        Let&apos;s find your office
      </H1>
      <Body2 className="text-center mt-4">
        Make sure it matches your candidacy papers from when you filed for
        office.
      </Body2>
      <div className="w-full max-w-2xl mt-10">
        {fields.map((field) => (
          <Fragment key={field.key}>
            <RenderInputField
              field={field}
              onChangeCallback={onChangeField}
              value={state[field.key]}
            />
          </Fragment>
        ))}
      </div>
    </>
  )
}
