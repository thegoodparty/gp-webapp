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

export default function SegmentSection() {
  const [open, setOpen] = useState(false)
  const [segment, setSegment] = useState('all')

  return (
    <div className="md:absolute md:left-0 md:top-4 flex items-center gap-4">
      <Select value={segment} onValueChange={setSegment}>
        <SelectTrigger className="w-full md:w-[240px]">
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
        </SelectContent>
      </Select>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Create a Segment
      </Button>
      <FiltersSheet
        open={open}
        handleClose={() => setOpen(false)}
        handleSave={() => setOpen(false)}
        handleOpenChange={setOpen}
      />
    </div>
  )
}
