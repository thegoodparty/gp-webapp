'use client'
import {
  Button,
  IconButton,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from 'goodparty-styleguide'

import { useState, useEffect, useRef } from 'react'
import FiltersSheet from './FiltersSheet'
import defaultSegments from '../configs/defaultSegments.config'
import { useCustomSegments } from '../../hooks/CustomSegmentsProvider'
import { ALL_SEGMENTS, SHEET_MODES } from '../shared/constants'
import {
  useRouter,
  useSearchParams,
  ReadonlyURLSearchParams,
} from 'next/navigation'
import appendParam from '@shared/utils/appendParam'
import {
  isCustomSegment,
  isDefaultSegment,
  findCustomSegment,
  trimCustomSegmentName,
} from '../shared/segments.util'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { useCampaign } from '@shared/hooks/useCampaign'
import { useShowContactProModal } from '../../hooks/ContactProModal'
import { Lock } from '@mui/icons-material'
import { LuPencil } from 'react-icons/lu'
import { type SegmentResponse } from '../shared/ajaxActions'

type SheetMode = (typeof SHEET_MODES)[keyof typeof SHEET_MODES]

interface SheetState {
  open: boolean
  mode: SheetMode
  editSegment: SegmentResponse | null
}

export default function SegmentSection() {
  const [customSegments, , , querySegment] = useCustomSegments()
  const [segment, setSegment] = useState<string>(ALL_SEGMENTS)
  const isInitialLoad = useRef(true)
  const [campaign] = useCampaign()
  const showProUpgradeModal = useShowContactProModal()
  const [sheetState, setSheetState] = useState<SheetState>({
    open: false,
    mode: SHEET_MODES.CREATE,
    editSegment: null,
  })

  const router = useRouter()
  const searchParams = useSearchParams()

  const setSegmentAndTrack = (
    segmentValue: string,
    type: 'custom' | 'default',
    shouldUpdateUrl = false,
  ) => {
    setSegment(segmentValue)
    isInitialLoad.current = false

    if (shouldUpdateUrl) {
      appendParam(
        router,
        searchParams ?? (new URLSearchParams() as ReadonlyURLSearchParams),
        'segment',
        segmentValue,
      )
    }

    const segmentName =
      type === 'custom'
        ? findCustomSegment(customSegments, segmentValue)?.name ?? segmentValue
        : segmentValue

    trackEvent(EVENTS.Contacts.SegmentViewed, {
      segment: segmentName,
      type,
    })
  }

  const handleDefaultSegment = () => {
    if (querySegment) {
      setSegmentAndTrack(querySegment, 'default')
    }
  }

  const handleCustomSegment = () => {
    if (querySegment) {
      setSegmentAndTrack(querySegment, 'custom')
    }
  }

  const handleInvalidSegment = () => {
    if (customSegments.length > 0) {
      setSegmentAndTrack(ALL_SEGMENTS, 'default', true)
    }
  }

  const handleNoQuerySegment = () => {
    setSegmentAndTrack(ALL_SEGMENTS, 'default')
  }

  const initializeSegment = () => {
    if (!querySegment) {
      handleNoQuerySegment()
      return
    }

    if (isDefaultSegment(defaultSegments, querySegment)) {
      handleDefaultSegment()
      return
    }

    if (isCustomSegment(customSegments, querySegment)) {
      handleCustomSegment()
      return
    }

    handleInvalidSegment()
  }

  useEffect(() => {
    if (isInitialLoad.current) {
      initializeSegment()
    }
  }, [querySegment, customSegments, router, searchParams])

  const isCustom = !isDefaultSegment(defaultSegments, segment)

  const handleEdit = () => {
    if (isCustom) {
      const customSegment = findCustomSegment(
        customSegments,
        segment,
      ) as SegmentResponse | null
      setSheetState({
        open: true,
        mode: SHEET_MODES.EDIT,
        editSegment: customSegment || null,
      })
    }
  }

  const handleCreateSegment = () => {
    if (!campaign?.isPro) {
      showProUpgradeModal(true)
      return
    }
    setSheetState({
      open: true,
      mode: SHEET_MODES.CREATE,
      editSegment: null,
    })
  }

  const handleSelect = (selectedSegment: string) => {
    if (!campaign?.isPro) {
      showProUpgradeModal(true)
      return
    }
    setSegment(selectedSegment)
    appendParam(
      router,
      searchParams ?? (new URLSearchParams() as ReadonlyURLSearchParams),
      'segment',
      selectedSegment,
    )
  }

  const handleSheetClose = () => {
    setSheetState({
      open: false,
      mode: SHEET_MODES.CREATE,
      editSegment: null,
    })
  }

  const resetSelect = () => {
    setSegment(ALL_SEGMENTS)
    appendParam(
      router,
      searchParams ?? (new URLSearchParams() as ReadonlyURLSearchParams),
      'segment',
      ALL_SEGMENTS,
    )
  }

  const query = searchParams?.get('query')
  useEffect(() => {
    if (query) {
      resetSelect()
    }
  }, [query])

  const handleAfterSave = (segmentId: number) => {
    setSegment(segmentId.toString())
    appendParam(
      router,
      searchParams ?? (new URLSearchParams() as ReadonlyURLSearchParams),
      'segment',
      segmentId.toString(),
    )
  }

  return (
    <div className="flex items-center flex-col w-full md:w-auto md:flex-row">
      <Select value={segment} onValueChange={handleSelect}>
        <SelectTrigger className="w-full lg:w-[350px] justify-start">
          <label
            htmlFor="segment-select"
            className="text-sm font-normal text-muted-foreground border-r pr-3 border-gray-200"
          >
            Current list
          </label>
          <div className="w-full text-left pl-1">
            <SelectValue placeholder="All Contacts" />
          </div>
        </SelectTrigger>
        <SelectContent className="max-h-[50vh]">
          <SelectGroup>
            <SelectLabel>Default Segments</SelectLabel>
            {defaultSegments.map((segment) => (
              <SelectItem key={segment.value} value={segment.value}>
                {segment.label}
              </SelectItem>
            ))}
          </SelectGroup>
          {customSegments && customSegments?.length > 0 && (
            <SelectGroup>
              <SelectLabel>Custom Segments</SelectLabel>
              {customSegments.map((segment) => (
                <SelectItem key={segment.id} value={segment.id.toString()}>
                  {segment.name
                    ? trimCustomSegmentName(segment.name)
                    : 'Unnamed Segment'}
                </SelectItem>
              ))}
            </SelectGroup>
          )}
        </SelectContent>
      </Select>
      <Button
        variant="default"
        onClick={handleCreateSegment}
        className="font-normal text-sm px-4 w-full mt-4 md:mt-0 mb-4 md:mb-0 md:w-auto md:ml-4"
      >
        {!campaign?.isPro && <Lock />}
        Create list
      </Button>

      {isCustom && (
        <>
          <IconButton
            variant="outline"
            onClick={handleEdit}
            className="ml-4 font-normal hidden md:flex"
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <LuPencil />
            </div>
          </IconButton>
          <Button
            variant="outline"
            onClick={handleEdit}
            className="flex md:hidden w-full"
          >
            Edit list
          </Button>
        </>
      )}
      <FiltersSheet
        open={sheetState.open}
        handleClose={handleSheetClose}
        handleOpenChange={(open) =>
          setSheetState((prev) => ({ ...prev, open }))
        }
        mode={sheetState.mode}
        editSegment={sheetState.editSegment}
        resetSelect={resetSelect}
        afterSave={handleAfterSave}
      />
    </div>
  )
}
