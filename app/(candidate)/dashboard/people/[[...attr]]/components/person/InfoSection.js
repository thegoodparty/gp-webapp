'use client'

import Overline from '@shared/typography/Overline'
import { usePerson } from '../PersonProvider'
import Body1 from '@shared/typography/Body1'

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
              <Overline>{field.label}</Overline>
              <Body1>
                {field.transform
                  ? field.transform(person[field.key])
                  : person[field.key]}
              </Body1>
            </div>
          )}
        </>
      ))}
    </section>
  )
}
