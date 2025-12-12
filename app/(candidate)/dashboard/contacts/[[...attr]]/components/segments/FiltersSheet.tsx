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
  type SegmentResponse,
  type ListContactsResponse,
} from '../shared/ajaxActions'
import { useSnackbar } from 'helpers/useSnackbar'
import { useCustomSegments } from '../../hooks/CustomSegmentsProvider'
import { SHEET_MODES } from '../shared/constants'
import DeleteSegment from './DeleteSegment'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import {
  filterOnlyTrueValues,
  trimCustomSegmentName,
} from '../shared/segments.util'
import { useRouter, useSearchParams } from 'next/navigation'
import { useContacts } from '../../hooks/ContactsProvider'
import appendParam from '@shared/utils/appendParam'

type SheetMode = (typeof SHEET_MODES)[keyof typeof SHEET_MODES]

interface Filters {
  [key: string]: boolean
}

interface BackendFilters extends Record<string, unknown> {
  languageCodes?: string[]
  incomeRanges?: string[]
  languageEnglish?: boolean
  languageSpanish?: boolean
  languageOther?: boolean
  id?: number
  createdAt?: unknown
  updatedAt?: unknown
  name?: string
  campaignId?: number
}

interface FiltersSheetProps {
  open?: boolean
  handleClose?: () => void
  mode?: SheetMode
  editSegment?: SegmentResponse | null
  handleOpenChange?: (open: boolean) => void
  resetSelect?: () => void
  afterSave?: (segmentId: number) => void
}

const refetchContacts = async ({
  page,
  resultsPerPage,
  segment,
}: {
  page: number
  resultsPerPage?: string | null
  segment: number | string
}): Promise<ListContactsResponse | null> => {
  const response = await fetchContacts({
    page,
    resultsPerPage: resultsPerPage ? parseInt(resultsPerPage, 10) : undefined,
    segment: typeof segment === 'number' ? segment.toString() : segment,
  })
  return response
}

const MAX_SEGMENT_NAME_LENGTH = 30

export default function Filters({
  open = false,
  handleClose = () => {},
  mode = SHEET_MODES.CREATE,
  editSegment = null,
  handleOpenChange = () => {},
  resetSelect = () => {},
  afterSave = () => {},
}: FiltersSheetProps) {
  const { successSnackbar, errorSnackbar } = useSnackbar()
  const [filters, setFilters] = useState<Filters>({})
  const [isEditingName, setIsEditingName] = useState(false)
  const [segmentName, setSegmentName] = useState('')
  const [saving, setSaving] = useState(false)
  const [customSegments, , refreshCustomSegments] = useCustomSegments()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, setContacts] = useContacts()

  const transformFiltersFromBackend = (
    backendFilters: BackendFilters,
  ): Filters => {
    const transformed: Filters = {}

    transformed.languageEnglish = false
    transformed.languageSpanish = false
    transformed.languageOther = false

    if (
      backendFilters.languageCodes &&
      Array.isArray(backendFilters.languageCodes)
    ) {
      transformed.languageEnglish = backendFilters.languageCodes.includes('en')
      transformed.languageSpanish = backendFilters.languageCodes.includes('es')
      transformed.languageOther = backendFilters.languageCodes.includes('other')
    }

    const incomeMapping: Record<string, string> = {
      'Under $25k': 'incomeUnder25k',
      '$25k - $35k': 'income25kTo35k',
      '$35k - $50k': 'income35kTo50k',
      '$50k - $75k': 'income50kTo75k',
      '$75k - $100k': 'income75kTo100k',
      '$100k - $125k': 'income100kTo125k',
      '$125k - $150k': 'income125kTo150k',
      '$150k - $200k': 'income150kTo200k',
      '$200k+': 'income200kPlus',
    }

    Object.values(incomeMapping).forEach((key) => {
      transformed[key] = false
    })

    if (
      backendFilters.incomeRanges &&
      Array.isArray(backendFilters.incomeRanges)
    ) {
      backendFilters.incomeRanges.forEach((range) => {
        const key = incomeMapping[range as string]
        if (key) {
          transformed[key] = true
        }
      })
    }

    return transformed
  }

  useEffect(() => {
    if (mode === SHEET_MODES.EDIT && editSegment) {
      const transformedSegment = transformFiltersFromBackend(editSegment)
      setFilters(transformedSegment)
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

  const handleSave = async () => {
    if (!canSave()) {
      errorSnackbar('Please select at least one filter')
      return
    }
    setSaving(true)
    const transformedFilters = transformFiltersForBackend(filters)
    const response = await saveCustomSegment({
      name: segmentName,
      ...transformedFilters,
    })
    if (response) {
      successSnackbar('Segment created successfully')
      trackEvent(EVENTS.Contacts.SegmentCreated, {
        filters: filterOnlyTrueValues(filters as Record<string, boolean>),
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
    if (!canSave() || !editSegment) {
      if (!canSave()) {
        errorSnackbar('Please select at least one filter')
      }
      return
    }
    setSaving(true)
    const cleanFilters = { ...filters }
    delete cleanFilters.id
    delete cleanFilters.createdAt
    delete cleanFilters.updatedAt
    delete cleanFilters.name
    delete cleanFilters.campaignId

    const transformedFilters = transformFiltersForBackend(cleanFilters)
    const response = await updateCustomSegment(editSegment.id, {
      name: segmentName,
      ...transformedFilters,
    })
    if (response) {
      successSnackbar('Segment updated successfully')
      trackEvent(EVENTS.Contacts.SegmentUpdated, {
        filters: filterOnlyTrueValues(filters),
      })
      const contactsResponse = await refetchContacts({
        page: 1,
        resultsPerPage: searchParams?.get('pageSize') ?? null,
        segment: editSegment.id,
      })
      if (contactsResponse && searchParams) {
        appendParam(router, searchParams, 'page', '1')
        setContacts(contactsResponse)
      }
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

  const canSave = (): boolean => {
    return (
      !!segmentName && Object.values(filters).some((value) => value === true)
    )
  }

  const transformFiltersForBackend = (
    filters: Filters,
  ): Record<string, unknown> => {
    const transformed: Record<string, unknown> = { ...filters }

    const languageCodes: string[] = []
    if (transformed.languageEnglish) {
      languageCodes.push('en')
    }
    if (transformed.languageSpanish) {
      languageCodes.push('es')
    }
    if (transformed.languageOther) {
      languageCodes.push('other')
    }
    delete transformed.languageEnglish
    delete transformed.languageSpanish
    delete transformed.languageOther
    transformed.languageCodes = languageCodes

    const incomeRanges: string[] = []
    const incomeMapping: Record<string, string> = {
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

    Object.entries(incomeMapping).forEach(([key, value]) => {
      if (transformed[key]) {
        incomeRanges.push(value)
      }
      delete transformed[key]
    })
    transformed.incomeRanges = incomeRanges

    return transformed
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
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
                        handleCheckedChange(checked === true, option.key)
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
            disabled={saving || !canSave()}
          >
            {mode === SHEET_MODES.EDIT ? 'Update Segment' : 'Create Segment'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
