'use client'
import Body1 from '@shared/typography/Body1'
import Body2 from '@shared/typography/Body2'
import {
  Button,
  Checkbox,
  Sheet,
  SheetContent,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from 'goodparty-styleguide'
import { useState } from 'react'
import { TbDownload } from 'react-icons/tb'
import filterSections from './filters.config'

export default function Filters() {
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState({})

  const handleCheckedChange = (checked, key) => {
    setFilters({ ...filters, [key]: checked })
  }
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <div className="absolute md:right-36 top-4 flex items-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">
              <TbDownload />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-white">Download .csv file</p>
          </TooltipContent>
        </Tooltip>

        <Button variant="outline" onClick={() => setOpen(true)}>
          filters
        </Button>
      </div>
      <Sheet open={open} onOpenChange={setOpen} onClose={handleClose}>
        <SheetContent className="w-[90vw] max-w-xl sm:max-w-xl  h-full overflow-y-auto p-4 lg:p-8 z-[1301]">
          <h2 className="text-3xl lg:text-4xl font-semibold">Add Filters</h2>
          <Body1 className="pb-6 border-b border-gray-200">
            Apply filters to refine your table
          </Body1>
          {filterSections.map((section, index) => (
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
              {index === filterSections.length - 1 && (
                <div className="h-20 "></div>
              )}
            </div>
          ))}
          <div className="fixed bottom-0 bg-white shadow-sm p-4 flex justify-center gap-4 w-[90vw] max-w-xl sm:max-w-xl right-0 border-t border-gray-200">
            <Button variant="outline" onClick={() => setFilters({})}>
              Clear Filters
            </Button>
            <Button variant="default">Apply Filters</Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
