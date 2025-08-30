'use client'

import { usePerson } from '../PersonProvider'
import Body1 from '@shared/typography/Body1'
import Body2 from '@shared/typography/Body2'

export default function InfoSection({ section }) {
  const [person] = usePerson()
  if (!person) return null
  return (
    <section className="mt-8">
      <h3 className="text-2xl font-semibold">{section.title}</h3>
      {section.fields.map((field) => (
        <>
          {field.key && person[field.key] && (
            <div key={field.key} className="mt-4">
              <Body2 className="font-medium text-gray-600">{field.label}</Body2>
              <Body1>
                {field.transform
                  ? field.transform(person[field.key], person)
                  : person[field.key]}
              </Body1>
            </div>
          )}
        </>
      ))}
    </section>
  )
}
