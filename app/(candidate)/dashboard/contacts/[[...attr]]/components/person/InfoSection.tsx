'use client'

import { usePerson } from '../../hooks/PersonProvider'
import Body1 from '@shared/typography/Body1'
import Body2 from '@shared/typography/Body2'
import CopyToClipboardButton from '@shared/utils/CopyToClipboardButton'
import { Fragment } from 'react'

type PersonRecord = Partial<Record<string, string | number | boolean | object | null>>

interface Field {
  key: string
  label: string
  transform?: (value: string | number | boolean | object | null, person: PersonRecord) => string | null
  allowCopy?: boolean
}

interface Section {
  title: string
  fields: Field[]
}

interface InfoSectionProps {
  section: Section
}

export default function InfoSection({ section }: InfoSectionProps) {
  const [person] = usePerson()
  if (!person) return null

  const getFieldValue = (key: string): string | number | boolean | object | null => {
    const value = person[key]
    return value !== undefined ? value : null
  }

  const isUnknown = (field: Field): boolean => {
    const rawValue = getFieldValue(field.key)
    if (typeof rawValue === 'string' && rawValue.toLowerCase() === 'unknown') {
      return true
    }

    if (field.transform && rawValue !== null) {
      const transformedValue = field.transform(rawValue, person)
      if (typeof transformedValue === 'string') {
        return transformedValue.toLowerCase() === 'unknown'
      }
      return transformedValue === null
    }

    return false
  }

  const getCopyText = (field: Field): string => {
    const rawValue = getFieldValue(field.key)
    if (!field.transform) {
      return String(rawValue ?? '')
    }

    const transformedValue = rawValue !== null ? field.transform(rawValue, person) : null
    return typeof transformedValue === 'string'
      ? transformedValue
      : String(rawValue ?? '')
  }

  return (
    <section className="mt-8">
      <h3 className="text-2xl font-semibold">{section.title}</h3>
      {section.fields.map((field) => {
        const fieldValue = getFieldValue(field.key)
        return (
          <Fragment key={field.key}>
            {field.key && fieldValue && (
              <div key={field.key} className="mt-4">
                <Body2 className="font-medium text-gray-600">{field.label}</Body2>
                <div className="flex items-center">
                  <Body1>
                    {field.transform
                      ? field.transform(fieldValue, person)
                      : String(fieldValue)}
                  </Body1>
                  {field.allowCopy && !isUnknown(field) && (
                    <CopyToClipboardButton
                      copyText={getCopyText(field)}
                      size="small"
                      color="neutral"
                      variant="text"
                      className="ml-2"
                    />
                  )}
                </div>
              </div>
            )}
          </Fragment>
        )
      })}
    </section>
  )
}
