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
import { useState } from 'react'
import FiltersSheet from './FiltersSheet'
import defaultSegments from '../configs/defaultSegments.config'
import { useCustomSegments } from '../../hooks/CustomSegmentsProvider'
import { FiEdit } from 'react-icons/fi'
import { ALL_SEGMENTS, SHEET_MODES } from '../constants'

export default function SegmentSection() {
  const [segment, setSegment] = useState(ALL_SEGMENTS)
  const [customSegments] = useCustomSegments()
  const [sheetState, setSheetState] = useState({
    open: false,
    mode: SHEET_MODES.CREATE,
    editSegment: null,
  })

  const isCustom = !defaultSegments.some(
    (defaultSegment) => defaultSegment.value === segment,
  )

  const handleEdit = () => {
    if (isCustom) {
      const customSegment = customSegments.find(
        (customSegment) => customSegment.id === segment,
      )
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
                <SelectItem key={segment.id} value={segment.id}>
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
