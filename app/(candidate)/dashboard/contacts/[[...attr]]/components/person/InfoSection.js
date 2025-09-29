'use client'

import { usePerson } from '../../hooks/PersonProvider'
import Body1 from '@shared/typography/Body1'
import Body2 from '@shared/typography/Body2'
import CopyToClipboardButton from '@shared/utils/CopyToClipboardButton'
import { Fragment } from 'react'

export default function InfoSection({ section }) {
  const [person] = usePerson()
  if (!person) return null

  const isUnknown = (field) => {
    if (!field.transform) {
      return person[field.key].toLowerCase() === 'unknown'
    }

    const value = field.transform(person[field.key], person)
    if (typeof value === 'string') {
      return value.toLowerCase() === 'unknown'
    }
    return value === null
  }
  return (
    <section className="mt-8">
      <h3 className="text-2xl font-semibold">{section.title}</h3>
      {section.fields.map((field) => (
        <Fragment key={field.key}>
          {field.key && person[field.key] && (
            <div key={field.key} className="mt-4">
              <Body2 className="font-medium text-gray-600">{field.label}</Body2>
              <div className="flex items-center">
                <Body1>
                  {field.transform
                    ? field.transform(person[field.key], person)
                    : person[field.key]}
                </Body1>
                {field.allowCopy && !isUnknown(field) && (
                  <CopyToClipboardButton
                    copyText={person[field.key]}
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
      ))}
    </section>
  )
}
