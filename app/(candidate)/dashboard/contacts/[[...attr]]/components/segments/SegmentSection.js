'use client'
import {
  Button,
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
import { FiEdit } from 'react-icons/fi'
import { ALL_SEGMENTS, SHEET_MODES } from '../shared/constants'
import { useRouter, useSearchParams } from 'next/navigation'
import appendParam from '@shared/utils/appendParam'
import {
  isCustomSegment,
  isDefaultSegment,
  findCustomSegment,
} from '../shared/segments.util'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'

const MAX_SEGMENT_NAME_LENGTH = 20

export const trimCustomSegmentName = (name) => {
  if (!name || typeof name !== 'string') {
    return 'custom segment'
  }

  if (name.length > MAX_SEGMENT_NAME_LENGTH) {
    if (name.includes('Campaign')) {
      const campaignEndIndex = name.indexOf('Campaign') + 8
      return campaignEndIndex <= MAX_SEGMENT_NAME_LENGTH
        ? name.slice(0, campaignEndIndex)
        : name.slice(0, MAX_SEGMENT_NAME_LENGTH) + '...'
    }
    return name.slice(0, MAX_SEGMENT_NAME_LENGTH) + '...'
  }
  return name
}

export default function SegmentSection() {
  const [customSegments, , , querySegment] = useCustomSegments()
  const [segment, setSegment] = useState(ALL_SEGMENTS)
  const isInitialLoad = useRef(true)

  const [sheetState, setSheetState] = useState({
    open: false,
    mode: SHEET_MODES.CREATE,
    editSegment: null,
  })

  const router = useRouter()
  const searchParams = useSearchParams()

  const setSegmentAndTrack = (segmentValue, type, shouldUpdateUrl = false) => {
    setSegment(segmentValue)
    isInitialLoad.current = false

    if (shouldUpdateUrl) {
      appendParam(router, searchParams, 'segment', segmentValue)
    }

    const segmentName =
      type === 'custom'
        ? findCustomSegment(customSegments, segmentValue)?.name || segmentValue
        : segmentValue

    trackEvent(EVENTS.Contacts.SegmentViewed, {
      segment: segmentName,
      type,
    })
  }

  const handleDefaultSegment = () => {
    setSegmentAndTrack(querySegment, 'default')
  }

  const handleCustomSegment = () => {
    setSegmentAndTrack(querySegment, 'custom')
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
      const customSegment = findCustomSegment(customSegments, segment)
      setSheetState({
        open: true,
        mode: SHEET_MODES.EDIT,
        editSegment: customSegment,
      })
    }
  }

  const handleCreateSegment = () => {
    setSheetState({
      open: true,
      mode: SHEET_MODES.CREATE,
      editSegment: null,
    })
  }

  const handleSelect = (selectedSegment) => {
    setSegment(selectedSegment)
    appendParam(router, searchParams, 'segment', selectedSegment)
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
    appendParam(router, searchParams, 'segment', ALL_SEGMENTS)
  }

  const handleAfterSave = (segmentId) => {
    setSegment(segmentId.toString())
    appendParam(router, searchParams, 'segment', segmentId.toString())
  }

  return (
    <div className="md:absolute md:left-0 md:top-4 flex items-center">
      <Select value={segment} onValueChange={handleSelect}>
        <SelectTrigger className="w-full md:w-[180px] lg:w-[240px]">
          <SelectValue placeholder="All Contacts" />
        </SelectTrigger>
        <SelectContent>
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
                  {trimCustomSegmentName(segment.name) || 'Unnamed Segment'}
                </SelectItem>
              ))}
            </SelectGroup>
          )}
        </SelectContent>
      </Select>
      {isCustom && (
        <div
          onClick={handleEdit}
          className="cursor-pointer w-10 h-10 flex items-center justify-center border-t border-b border-r border-gray-200 rounded-md -ml-1 hover:text-blue-500 :hover:text-white"
        >
          <FiEdit />
        </div>
      )}
      <Button
        variant="secondary"
        onClick={handleCreateSegment}
        className="ml-4"
      >
        Create a Segment
      </Button>
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
