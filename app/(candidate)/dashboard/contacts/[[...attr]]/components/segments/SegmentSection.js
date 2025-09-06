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

export default function SegmentSection() {
  const [open, setOpen] = useState(false)
  const [segment, setSegment] = useState('all')
  const [edit, setEdit] = useState(false)
  const [customSegments] = useCustomSegments()
  const [isCustom, setIsCustom] = useState(false)

  const handleEdit = () => {
    if (isCustom) {
      const customSegment = customSegments.find(
        (customSegment) => customSegment.id === segment,
      )
      setEdit(customSegment)
      setOpen(true)
    } else {
      setEdit(false)
    }
  }

  const handleSelect = (selectedSegment) => {
    setSegment(selectedSegment)
    const isCustomSelected = !defaultSegments.some(
      (defaultSegment) => defaultSegment.value === selectedSegment,
    )
    setIsCustom(isCustomSelected)
    if (!isCustomSelected) {
      setEdit(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setEdit(false)
  }

  return (
    <div className="md:absolute md:left-0 md:top-4 flex items-center gap-4">
      <Select value={segment} onValueChange={handleSelect}>
        <SelectTrigger className="w-full md:w-[210px] lg:w-[240px]">
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
          {customSegments.length > 0 && (
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
          edit
        </div>
      )}
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Create a Segment
      </Button>
      <FiltersSheet
        open={open}
        handleClose={handleClose}
        handleOpenChange={setOpen}
        customSegment={edit}
      />
    </div>
  )
}
