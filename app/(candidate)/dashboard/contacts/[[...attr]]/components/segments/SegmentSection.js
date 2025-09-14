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

  useEffect(() => {
    if (isInitialLoad.current) {
      if (querySegment) {
        const isDefault = isDefaultSegment(defaultSegments, querySegment)

        if (isDefault) {
          setSegment(querySegment)
          isInitialLoad.current = false
        } else {
          const isCustom = isCustomSegment(customSegments, querySegment)

          if (isCustom) {
            setSegment(querySegment)
            isInitialLoad.current = false
          } else if (customSegments.length > 0) {
            setSegment(ALL_SEGMENTS)
            appendParam(router, searchParams, 'segment', ALL_SEGMENTS)
            isInitialLoad.current = false
          }
        }
      } else {
        setSegment(ALL_SEGMENTS)
        isInitialLoad.current = false
      }
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

  return (
    <div className="md:absolute md:left-0 md:top-4 flex items-center gap-4">
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
                  {segment.name}
                </SelectItem>
              ))}
            </SelectGroup>
          )}
        </SelectContent>
      </Select>
      {isCustom && (
        <div
          onClick={handleEdit}
          className="cursor-pointer text-blue-500 underline"
        >
          <FiEdit />
        </div>
      )}
      <Button variant="secondary" onClick={handleCreateSegment}>
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
      />
    </div>
  )
}
