'use client'
import Body2 from '@shared/typography/Body2'
import {
  Button,
  Checkbox,
  Input,
  Sheet,
  SheetContent,
} from 'goodparty-styleguide'
import { useEffect, useState } from 'react'
import filterSections from '../configs/filters.config'
import { FiEdit } from 'react-icons/fi'
import {
  fetchContacts,
  saveCustomSegment,
  updateCustomSegment,
} from '../shared/ajaxActions'
import { useSnackbar } from 'helpers/useSnackbar'
import { useCustomSegments } from '../../hooks/CustomSegmentsProvider'
import { SHEET_MODES } from '../shared/constants'
import DeleteSegment from './DeleteSegment'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { filterOnlyTrueValues } from '../shared/segments.util'
import { useRouter, useSearchParams } from 'next/navigation'
import { useContacts } from '../../hooks/ContactsProvider'
import appendParam from '@shared/utils/appendParam'

const refetchContacts = async ({ page, resultsPerPage, segment }) => {
  const response = await fetchContacts({ page, resultsPerPage, segment })
  return response
}

export default function Filters({
  open = false,
  handleClose = () => {},
  mode = SHEET_MODES.CREATE,
  editSegment = null,
  handleOpenChange = () => {},
  resetSelect = () => {},
  afterSave = () => {},
}) {
  const { successSnackbar, errorSnackbar } = useSnackbar()
  const [filters, setFilters] = useState({})
  const [isEditingName, setIsEditingName] = useState(false)
  const [segmentName, setSegmentName] = useState('')
  const [saving, setSaving] = useState(false)
  const [customSegments, , refreshCustomSegments] = useCustomSegments()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [_, setContacts] = useContacts()

  useEffect(() => {
    if (mode === SHEET_MODES.EDIT && editSegment) {
      setFilters(editSegment)
      setSegmentName(editSegment.name)
      setIsEditingName(false)
    } else {
      const nextCustomSegmentName = `Custom Segment ${
        (customSegments.length || 0) + 1
      }`
      setFilters({})
      setSegmentName(nextCustomSegmentName)
      setIsEditingName(false)
    }
  }, [mode, editSegment, open, customSegments])

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
    if (!canSave()) {
      errorSnackbar('Please select at least one filter')
      return
    }
    setSaving(true)
    const response = await saveCustomSegment({
      name: segmentName,
      ...filters,
    })
    if (response) {
      successSnackbar('Segment created successfully')
      trackEvent(EVENTS.Contacts.SegmentCreated, {
        filters: filterOnlyTrueValues(filters),
      })
      await refreshCustomSegments()
      afterSave(response.id)
    } else {
      await refreshCustomSegments()
      errorSnackbar('Failed to create segment')
    }
    setSaving(false)
    handleClose()
  }

  const handleUpdate = async () => {
    if (!canSave()) {
      errorSnackbar('Please select at least one filter')
      return
    }
    setSaving(true)
    const cleanFilters = { ...filters }
    delete cleanFilters.id
    delete cleanFilters.createdAt
    delete cleanFilters.updatedAt
    delete cleanFilters.name
    delete cleanFilters.campaignId

    const response = await updateCustomSegment(editSegment.id, {
      name: segmentName,
      ...cleanFilters,
    })
    if (response) {
      successSnackbar('Segment updated successfully')
      trackEvent(EVENTS.Contacts.SegmentUpdated, {
        filters: filterOnlyTrueValues(filters),
      })
      const { people } = await refetchContacts({
        page: 1,
        resultsPerPage: searchParams.get('pageSize'),
        segment: editSegment.id,
      })
      appendParam(router, searchParams, 'page', 1)
      setContacts(people)
    } else {
      errorSnackbar('Failed to update segment')
    }
    await refreshCustomSegments()
    setSaving(false)
    handleClose()
  }

  const handleAfterDelete = () => {
    handleClose()
    resetSelect()
  }

  const canSave = () => {
    return segmentName && Object.values(filters).some((value) => value)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange} onClose={handleClose}>
      <SheetContent className="w-[90vw] max-w-xl sm:max-w-xl  h-full overflow-y-auto p-4 lg:p-8 z-[1301]">
        <div className="flex items-center pb-6 border-b border-gray-200">
          {isEditingName ? (
            <Input
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsEditingName(false)
                }
              }}
              autoFocus
            />
          ) : (
            <>
              <h2 className="text-3xl lg:text-4xl font-semibold ">
                {segmentName}
              </h2>
              <FiEdit
                className="text-2xl ml-4 cursor-pointer"
                onClick={() => setIsEditingName(true)}
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
              <>
                {mode === SHEET_MODES.EDIT && (
                  <DeleteSegment
                    segment={editSegment}
                    afterDeleteCallback={handleAfterDelete}
                  />
                )}
                <div className="h-20 "></div>
              </>
            )}
          </div>
        ))}

        <div className="fixed bottom-0 bg-white shadow-sm p-4 flex justify-end gap-4 w-[90vw] max-w-xl sm:max-w-xl right-0 border-t border-gray-200">
          <Button variant="outline" onClick={() => setFilters({})}>
            Clear Filters
          </Button>
          <Button
            variant="default"
            onClick={mode === SHEET_MODES.EDIT ? handleUpdate : handleSave}
            disabled={saving || !canSave()}
          >
            {mode === SHEET_MODES.EDIT ? 'Update Segment' : 'Create Segment'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
