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
        ],
      },
      {
        key: 'political_party',
        label: 'Political Party',
        options: [
          { key: 'party_democrat', label: 'Democrat' },
          { key: 'party_non_partisan', label: 'Non Partisan' },
          { key: 'party_republican', label: 'Republican' },
        ],
      },
    ],
  },
  {
    title: 'Contact Information',
    fields: [
      {
        key: 'address',
        label: 'Address',
        options: [
          { key: 'has_address', label: 'Has Address' },
          { key: 'address_not_listed', label: 'Address Not Listed' },
        ],
      },
      {
        key: 'cell_phone',
        label: 'Cell Phone',
        options: [
          { key: 'has_cell_phone', label: 'Has Cell Phone' },
          { key: 'cell_phone_not_listed', label: 'Cell Phone Not Listed' },
        ],
      },
      {
        key: 'landline',
        label: 'Landline',
        options: [
          { key: 'has_landline', label: 'Has Landline' },
          { key: 'landline_not_listed', label: 'Landline Not Listed' },
        ],
      },
      {
        key: 'email',
        label: 'Email',
        options: [
          { key: 'has_email', label: 'Has Email' },
          { key: 'email_not_listed', label: 'Email Not Listed' },
        ],
      },
    ],
  },
  {
    title: 'Voter Demographics',
    fields: [
      {
        key: 'registered_voter',
        label: 'Registered Voter',
        options: [
          { key: 'registered_yes', label: 'Yes' },
          { key: 'registered_no', label: 'No' },
          { key: 'registered_unknown', label: 'Unknown' },
        ],
      },
      {
        key: 'active_voter',
        label: 'Active Voter',
        options: [
          { key: 'active_yes', label: 'Yes' },
          { key: 'active_no', label: 'No' },
        ],
      },
      {
        key: 'voter_likely',
        label: 'Voter Likely',
        options: [
          { key: 'likely_first_time', label: 'First Time' },
          { key: 'likely_likely', label: 'Likely' },
          { key: 'likely_super', label: 'Super' },
          { key: 'likely_unknown', label: 'Unknown' },
        ],
      },
    ],
  },
  {
    title: 'Demographic Information',
    fields: [
      {
        key: 'marital_status',
        label: 'Marital Status',
        options: [
          { key: 'marital_married', label: 'Married' },
          { key: 'marital_likely_married', label: 'Likely Married' },
          { key: 'marital_single', label: 'Single' },
          { key: 'marital_likely_single', label: 'Likely Single' },
          { key: 'marital_unknown', label: 'Unknown' },
        ],
      },
      {
        key: 'has_children',
        label: 'Has Children Under 18',
        options: [
          { key: 'children_no', label: 'No' },
          { key: 'children_yes', label: 'Yes' },
          { key: 'children_unknown', label: 'Unknown' },
        ],
      },
      {
        key: 'veteran_status',
        label: 'Veteran Status',
        options: [
          { key: 'veteran_yes', label: 'Yes' },
          { key: 'veteran_no', label: 'No' },
          { key: 'veteran_unknown', label: 'Unknown' },
        ],
      },
      {
        key: 'business_owner',
        label: 'Business Owner',
        options: [
          { key: 'business_yes', label: 'Yes' },
          { key: 'business_likely', label: 'Likely' },
          { key: 'business_no', label: 'No' },
          { key: 'business_unknown', label: 'Unknown' },
        ],
      },
      {
        key: 'education',
        label: 'Education',
        options: [
          { key: 'education_high_school', label: 'High School' },
          { key: 'education_some_college', label: 'Some College' },
          { key: 'education_technical_school', label: 'Technical School' },
          { key: 'education_some_college_degree', label: 'Some College' },
          { key: 'education_college_degree', label: 'College Degree' },
          { key: 'education_graduate_degree', label: 'Graduate Degree' },
          { key: 'education_unknown', label: 'Unknown' },
        ],
      },
      {
        key: 'household_income',
        label: 'Household Income',
        options: [
          { key: 'income_15_25k', label: '$15 - $25k' },
          { key: 'income_25_35k', label: '$25 - $35k' },
          { key: 'income_35_50k', label: '$35k - $50k' },
          { key: 'income_50_75k', label: '$50k - $75k' },
          { key: 'income_75_100k', label: '$75k - $100k' },
          { key: 'income_100_125k', label: '$100k - $125k' },
          { key: 'income_125_150k', label: '$125k - $150k' },
          { key: 'income_150_175k', label: '$150k - $175k' },
          { key: 'income_175_200k', label: '$175k - $200k' },
          { key: 'income_200_250k', label: '$200k - $250k' },
          { key: 'income_250k_plus', label: '$250k +' },
          { key: 'income_unknown', label: 'Unknown' },
        ],
      },
      {
        key: 'language',
        label: 'Language',
        options: [
          { key: 'language_english', label: 'English' },
          { key: 'language_spanish', label: 'Spanish' },
          { key: 'language_other', label: 'Other' },
        ],
      },
      {
        key: 'ethnicity',
        label: 'Ethnicity',
        options: [
          { key: 'ethnicity_caucasian', label: 'Caucasian' },
          { key: 'ethnicity_african_american', label: 'African American' },
          { key: 'ethnicity_asian', label: 'Asian' },
          { key: 'ethnicity_european', label: 'European' },
          { key: 'ethnicity_hispanic', label: 'Hispanic' },
          { key: 'ethnicity_unknown', label: 'Unknown' },
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
