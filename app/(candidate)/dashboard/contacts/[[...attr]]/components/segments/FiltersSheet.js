'use client'
import Body2 from '@shared/typography/Body2'
import {
  Button,
  Checkbox,
  Input,
  Sheet,
  SheetContent,
} from 'goodparty-styleguide'
import { useState } from 'react'
import filterSections from '../configs/filters.config'
import { FiEdit } from 'react-icons/fi'
import { saveCustomSegment } from '../ajacActions'
import { useSnackbar } from 'helpers/useSnackbar'

export default function Filters({
  open = false,
  handleClose = () => {},

  handleOpenChange = () => {},
}) {
  const { successSnackbar, errorSnackbar } = useSnackbar()
  const [filters, setFilters] = useState({})
  const [edit, setEdit] = useState(false)
  const [segmentName, setSegmentName] = useState('Custom Segment 1')
  const [saving, setSaving] = useState(false)

  const handleCheckedChange = (checked, key) => {
    setFilters({ ...filters, [key]: checked })
  }

  const handleSelectAll = (options) => {
    const updatedFilters = { ...filters }
    options.forEach((option) => {
      updatedFilters[option.key] = true
    })

    setFilters(updatedFilters)
  }

  const handleSave = async () => {
    setSaving(true)
    const response = await saveCustomSegment({
      name: segmentName,
      ...filters,
    })
    if (response) {
      successSnackbar('Segment created successfully')
    } else {
      errorSnackbar('Failed to create segment')
    }
    setSaving(false)
    handleClose()
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange} onClose={handleClose}>
      <SheetContent className="w-[90vw] max-w-xl sm:max-w-xl  h-full overflow-y-auto p-4 lg:p-8 z-[1301]">
        <div className="flex items-center pb-6 border-b border-gray-200">
          {edit ? (
            <Input
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
            />
          ) : (
            <>
              <h2 className="text-3xl lg:text-4xl font-semibold ">
                {segmentName}
              </h2>
              <FiEdit
                className="text-2xl ml-4 cursor-pointer"
                onClick={() => setEdit(true)}
              />
            </>
          )}
        </div>

        {filterSections.map((section, index) => (
          <div key={section.title} className="mt-4">
            <h3 className="text-xl lg:text-2xl font-semibold">
              {section.title}
            </h3>
            {section.fields.map((field) => (
              <div key={field.key} className="mt-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-medium text-gray-600">
                    {field.label}
                  </h4>
                  <div
                    className="text-xs font-semibold cursor-pointer text-blue-500"
                    onClick={() => handleSelectAll(field.options)}
                  >
                    Select All
                  </div>
                </div>
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
        <div className="fixed bottom-0 bg-white shadow-sm p-4 flex justify-end gap-4 w-[90vw] max-w-xl sm:max-w-xl right-0 border-t border-gray-200">
          <Button variant="outline" onClick={() => setFilters({})}>
            Clear Filters
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            disabled={saving || !segmentName}
          >
            Create Segment
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
