'use client'
import Body2 from '@shared/typography/Body2'
import {
  Button,
  Checkbox,
  Input,
  Sheet,
  SheetContent,
  SheetTitle,
} from 'goodparty-styleguide'
import { useEffect, useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import filterSections from '../configs/filters.config'
import { FiEdit } from 'react-icons/fi'
import {
  saveCustomSegment,
  updateCustomSegment,
  type SegmentResponse,
} from '../shared/ajaxActions'
import { useSnackbar } from 'helpers/useSnackbar'
import { useContactsTable } from '../../hooks/ContactsTableProvider'
import { SHEET_MODES } from '../shared/constants'
import DeleteSegment from './DeleteSegment'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import {
  filterOnlyTrueValues,
  trimCustomSegmentName,
} from '../shared/segments.util'

type SheetMode = (typeof SHEET_MODES)[keyof typeof SHEET_MODES]

interface Filters {
  [key: string]: boolean
}

interface BackendFilters extends Record<string, unknown> {
  languageCodes?: string[]
  incomeRanges?: string[]
  incomeUnknown?: boolean
}

interface FiltersSheetProps {
  open: boolean
  handleClose: () => void
  mode: SheetMode
  editSegment: SegmentResponse | null
  handleOpenChange: (open: boolean) => void
  resetSelect: () => void
  afterSave: (segmentId: number) => void
}

const MAX_SEGMENT_NAME_LENGTH = 30

const INCOME_KEY_TO_RANGE: Record<string, string> = {
  incomeUnder25k: 'Under $25k',
  income25kTo35k: '$25k - $35k',
  income35kTo50k: '$35k - $50k',
  income50kTo75k: '$50k - $75k',
  income75kTo100k: '$75k - $100k',
  income100kTo125k: '$100k - $125k',
  income125kTo150k: '$125k - $150k',
  income150kTo200k: '$150k - $200k',
  income200kPlus: '$200k+',
}

const RANGE_TO_INCOME_KEY: Record<string, string> = Object.fromEntries(
  Object.entries(INCOME_KEY_TO_RANGE).map(([k, v]) => [v, k]),
)

const LANGUAGE_KEY_TO_CODE: Record<string, string> = {
  languageEnglish: 'en',
  languageSpanish: 'es',
  languageOther: 'other',
}

const LANGUAGE_KEYS = new Set(Object.keys(LANGUAGE_KEY_TO_CODE))
const INCOME_KEYS = new Set([
  ...Object.keys(INCOME_KEY_TO_RANGE),
  'incomeUnknown',
])

const ALL_FILTER_OPTION_KEYS = filterSections.flatMap((section) =>
  section.fields.flatMap((field) => field.options.map((opt) => opt.key)),
)

const transformFiltersFromBackend = (backend: BackendFilters): Filters => {
  const result: Filters = {}

  for (const key of ALL_FILTER_OPTION_KEYS) {
    if (LANGUAGE_KEYS.has(key) || INCOME_KEYS.has(key)) continue
    result[key] = !!backend[key]
  }

  const languageCodes = Array.isArray(backend.languageCodes)
    ? backend.languageCodes
    : []
  for (const [key, code] of Object.entries(LANGUAGE_KEY_TO_CODE)) {
    result[key] = languageCodes.includes(code)
  }

  const incomeRanges = Array.isArray(backend.incomeRanges)
    ? backend.incomeRanges
    : []
  for (const key of Object.keys(INCOME_KEY_TO_RANGE)) {
    result[key] = false
  }
  for (const range of incomeRanges) {
    const key = RANGE_TO_INCOME_KEY[range]
    if (key) result[key] = true
  }
  result.incomeUnknown = !!backend.incomeUnknown

  return result
}

const transformFiltersForBackend = (filters: Filters): BackendFilters => {
  const result: BackendFilters = {}

  for (const key of ALL_FILTER_OPTION_KEYS) {
    if (LANGUAGE_KEYS.has(key) || INCOME_KEYS.has(key)) continue
    result[key] = !!filters[key]
  }

  const languageCodes: string[] = []
  for (const [key, code] of Object.entries(LANGUAGE_KEY_TO_CODE)) {
    if (filters[key]) languageCodes.push(code)
  }
  result.languageCodes = languageCodes

  const incomeRanges: string[] = []
  for (const [key, range] of Object.entries(INCOME_KEY_TO_RANGE)) {
    if (filters[key]) incomeRanges.push(range)
  }
  result.incomeRanges = incomeRanges
  result.incomeUnknown = !!filters.incomeUnknown

  return result
}

export default function Filters({
  open = false,
  handleClose,
  mode,
  editSegment,
  handleOpenChange,
  resetSelect,
  afterSave,
}: FiltersSheetProps) {
  const { successSnackbar, errorSnackbar } = useSnackbar()
  const [filters, setFilters] = useState<Filters>({})
  const [isEditingName, setIsEditingName] = useState(false)
  const [segmentName, setSegmentName] = useState('')
  const {
    customSegments,
    refreshCustomSegments,
    selectSegment,
    isElectedOfficial,
  } = useContactsTable()

  const displayFilterSections = useMemo(
    () =>
      isElectedOfficial
        ? filterSections.map((section) => ({
            ...section,
            fields: section.fields.filter(
              (field) => field.key !== 'political_party',
            ),
          }))
        : filterSections,
    [isElectedOfficial],
  )

  useEffect(() => {
    if (mode === SHEET_MODES.EDIT && editSegment) {
      setFilters(transformFiltersFromBackend(editSegment))
      setSegmentName(editSegment.name || '')
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

  const saveMutation = useMutation({
    mutationFn: async (payload: { name: string } & BackendFilters) => {
      const response = await saveCustomSegment(payload)
      if (!response) throw new Error('Failed to create segment')
      return response
    },
    onSuccess: async (response) => {
      successSnackbar('Segment created successfully')
      trackEvent(EVENTS.Contacts.SegmentCreated, {
        filters: filterOnlyTrueValues(filters),
      })
      await refreshCustomSegments()
      afterSave(response.id)
      handleClose()
    },
    onError: async () => {
      errorSnackbar('Failed to create segment')
      await refreshCustomSegments()
      handleClose()
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: { id: number; name: string } & BackendFilters) => {
      const response = await updateCustomSegment(id, payload)
      if (!response) throw new Error('Failed to update segment')
      return response
    },
    onSuccess: async (_data, variables) => {
      successSnackbar('Segment updated successfully')
      trackEvent(EVENTS.Contacts.SegmentUpdated, {
        filters: filterOnlyTrueValues(filters),
      })
      await refreshCustomSegments()
      selectSegment(variables.id.toString())
      handleClose()
    },
    onError: async () => {
      errorSnackbar('Failed to update segment')
      await refreshCustomSegments()
      handleClose()
    },
    onSettled: () => {},
  })

  const isSaving = saveMutation.isPending || updateMutation.isPending

  const handleCheckedChange = (checked: boolean, key: string) => {
    setFilters({ ...filters, [key]: checked })
  }

  const handleSelectAll = (options: Array<{ key: string; label: string }>) => {
    const updatedFilters = { ...filters }
    options.forEach((option) => {
      updatedFilters[option.key] = true
    })

    setFilters(updatedFilters)
  }

  const handleSave = () => {
    if (!canSave()) {
      errorSnackbar('Please select at least one filter')
      return
    }
    saveMutation.mutate({
      name: segmentName,
      ...transformFiltersForBackend(filters),
    })
  }

  const handleUpdate = () => {
    if (!canSave() || !editSegment) {
      if (!canSave()) errorSnackbar('Please select at least one filter')
      return
    }
    updateMutation.mutate({
      id: editSegment.id,
      name: segmentName,
      ...transformFiltersForBackend(filters),
    })
  }

  const handleAfterDelete = () => {
    handleClose()
    resetSelect()
  }

  const canSave = (): boolean => {
    return (
      !!segmentName && Object.values(filters).some((value) => value === true)
    )
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTitle className="sr-only"> Filters </SheetTitle>
      <SheetContent className="w-[90vw] max-w-xl sm:max-w-xl  h-full overflow-y-auto p-4 lg:p-8 z-[1301]">
        <div className="flex items-center pb-6 border-b border-gray-200">
          {isEditingName ? (
            <Input
              value={segmentName}
              onChange={(e) =>
                setSegmentName(e.target.value.slice(0, MAX_SEGMENT_NAME_LENGTH))
              }
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsEditingName(false)
                }
              }}
              autoFocus
              maxLength={MAX_SEGMENT_NAME_LENGTH}
            />
          ) : (
            <>
              <h2 className="text-3xl lg:text-4xl font-semibold ">
                {trimCustomSegmentName(segmentName)}
              </h2>
              <FiEdit
                className="text-2xl ml-4 cursor-pointer"
                onClick={() => setIsEditingName(true)}
              />
            </>
          )}
        </div>

        {displayFilterSections.map((section, index) => (
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
                        handleCheckedChange(checked === true, option.key)
                      }}
                      className="data-[state=checked]:!bg-purple-600 data-[state=checked]:!border-purple-600 data-[state=checked]:!text-white [&[data-state=checked]]:!bg-purple-600"
                    />
                    <Body2 className="font-medium ml-2">{option.label}</Body2>
                  </div>
                ))}
              </div>
            ))}

            {index === displayFilterSections.length - 1 && (
              <>
                {mode === SHEET_MODES.EDIT && editSegment && (
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
            disabled={isSaving || !canSave()}
          >
            {mode === SHEET_MODES.EDIT ? 'Update Segment' : 'Create Segment'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
