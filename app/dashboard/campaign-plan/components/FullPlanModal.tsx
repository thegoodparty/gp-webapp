'use client'
import { useIsMobile } from '@styleguide/hooks/use-mobile'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  ScrollArea,
} from '@styleguide'
import { Campaign } from 'helpers/types'
import { dateUsHelper } from 'helpers/dateHelper'
import { startOfWeek, addWeeks, endOfWeek, format } from 'date-fns'
import type { Task } from 'app/dashboard/components/tasks/TaskItem'
import { DISPLAY_TASK_TYPES } from 'app/dashboard/shared/constants/tasks.const'

interface FullPlanModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  campaign: Campaign
  tasks: Task[]
}

function formatWeekRange(weekStart: Date): string {
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 })
  const startMonth = format(weekStart, 'MMM')
  const endMonth = format(weekEnd, 'MMM')
  if (startMonth === endMonth) {
    return `${startMonth} ${format(weekStart, 'd')}-${format(weekEnd, 'd')}`
  }
  return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}`
}

function PlanHeader({ campaign }: { campaign: Campaign }) {
  const { details, firstName, lastName } = campaign
  const candidateName =
    firstName && lastName ? `${firstName} ${lastName}` : undefined
  const office = details?.office || details?.otherOffice
  const city = details?.city
  const state = details?.state
  const location = [office, city, state].filter(Boolean).join(', ')
  const electionDate = details?.electionDate
  const primaryDate = details?.primaryElectionDate

  return (
    <div className="text-sm leading-5 text-muted-foreground">
      {candidateName && <p>{candidateName}</p>}
      {location && <p>{location}</p>}
      {electionDate && <p>Election Date: {dateUsHelper(electionDate)}</p>}
      {!primaryDate && <p>No Primary Election</p>}
      {primaryDate && <p>Primary Election: {dateUsHelper(primaryDate)}</p>}
    </div>
  )
}

interface WeekGroup {
  week: number
  label: string
  tasks: Task[]
}

function buildWeekGroups(tasks: Task[], electionDate?: string): WeekGroup[] {
  const byWeek = new Map<number, Task[]>()
  for (const task of tasks) {
    const existing = byWeek.get(task.week) ?? []
    existing.push(task)
    byWeek.set(task.week, existing)
  }

  const weekNumbers = [...byWeek.keys()].sort((a, b) => b - a)

  return weekNumbers.map((week) => {
    let label: string
    if (electionDate) {
      const weekStart = startOfWeek(addWeeks(new Date(electionDate), -week), {
        weekStartsOn: 0,
      })
      label = formatWeekRange(weekStart)
    } else {
      label = `Week ${week}`
    }
    return { week, label, tasks: byWeek.get(week) ?? [] }
  })
}

function PlanContent({
  tasks,
  electionDate,
}: {
  tasks: Task[]
  electionDate?: string
}) {
  const groups = buildWeekGroups(tasks, electionDate)
  if (groups.length === 0) return null

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <div key={group.week} className="flex flex-col gap-2">
          <h2 className="font-outfit text-base font-semibold text-foreground">
            {group.label}
          </h2>
          <ul className="flex flex-col gap-1">
            {group.tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {DISPLAY_TASK_TYPES[task.flowType] ?? task.flowType}
                </span>
                <span>{task.title}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default function FullPlanModal({
  open,
  onOpenChange,
  campaign,
  tasks,
}: FullPlanModalProps) {
  const isMobile = useIsMobile()
  const electionDate = campaign.details?.electionDate

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="px-6 pt-4 pb-0">
            <DrawerTitle className="text-lg font-semibold leading-none">
              Your Full Plan
            </DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1 overflow-auto px-6 pb-6 pt-4">
            <PlanHeader campaign={campaign} />
            <div className="mt-6">
              <PlanContent tasks={tasks} electionDate={electionDate} />
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-[425px] gap-4 overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-lg font-semibold leading-none">
            Your Full Plan
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(80vh-80px)] overflow-auto px-6 pb-6">
          <PlanHeader campaign={campaign} />
          <div className="mt-6">
            <PlanContent tasks={tasks} electionDate={electionDate} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
