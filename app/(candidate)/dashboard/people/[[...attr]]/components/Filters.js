'use client'
import Body1 from '@shared/typography/Body1'
import Body2 from '@shared/typography/Body2'
import { Button, Checkbox, Sheet, SheetContent } from 'goodparty-styleguide'
import { useState } from 'react'

const filterSections = [
  {
    title: 'General Information',
    fields: [
      {
        key: 'gender',
        label: 'Gender',
        options: [
          { key: 'gender_male', label: 'Male' },
          { key: 'gender_female', label: 'Female' },
          { key: 'gender_unknown', label: 'Unknown' },
        ],
      },
      {
        key: 'age',
        label: 'Age',
        options: [
          { key: 'age_18_25', label: '18-25' },
          { key: 'age_25_35', label: '25-35' },
          { key: 'age_35_50', label: '35-50' },
          { key: 'age_50_plus', label: '50+' },
          { key: 'age_unknown', label: 'Unknown' },
        ],
      },
    ],
  },
]

export default function Filters() {
  const [open, setOpen] = useState(true)
  const [filters, setFilters] = useState({})

  const handleCheckedChange = (checked, key) => {
    console.log('checked', checked, 'key', key)
    setFilters({ ...filters, [key]: checked })
  }

  console.log('filters', filters)

  return (
    <>
      <div className="md:absolute right-36 top-4">
        <Button onClick={() => setOpen(true)}>filters</Button>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-[90vw] max-w-xl sm:max-w-xl  h-full overflow-y-auto p-4 lg:p-8">
          <h2 className="text-3xl lg:text-4xl font-semibold">Add Filters</h2>
          <Body1 className="pb-6 border-b border-gray-200">
            Apply filters to refine your table
          </Body1>
          {filterSections.map((section) => (
            <div key={section.title} className="mt-4">
              <h3 className="text-xl lg:text-2xl font-semibold">
                {section.title}
              </h3>
              {section.fields.map((field) => (
                <div key={field.key} className="mt-4">
                  <h4 className="text-xs font-medium text-gray-600">
                    {field.label}
                  </h4>
                  {field.options.map((option) => (
                    <div key={option.key} className="mt-2 flex items-center ">
                      <Checkbox
                        checked={filters[option.key] ?? false}
                        onCheckedChange={(checked) => {
                          handleCheckedChange(checked, option.key)
                        }}
                        className="data-[state=checked]:!bg-purple-600 data-[state=checked]:!border-purple-600 data-[state=checked]:!text-white [&[data-state=checked]]:!bg-purple-600"
                      />
                      <Body2 className="font-medium ml-2">{option.label}</Body2>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </SheetContent>
      </Sheet>
    </>
  )
}
