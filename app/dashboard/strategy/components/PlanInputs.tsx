'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import {
  Button,
  Card,
  CardContent,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
} from '@styleguide'
import { numberFormatter } from 'helpers/numberHelper'
import type { PlanData } from './planContent'

interface Volunteer {
  id: string
  name: string
  hoursPerWeek: number
}

interface PlanInputsProps {
  plan: PlanData
}

const formatDollars = (value: number): string =>
  `$${numberFormatter(Math.round(value))}`

const Gap = ({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element => (
  <p className="text-xs text-muted-foreground">{children}</p>
)

const PlanInputs = ({ plan }: PlanInputsProps): React.JSX.Element => {
  const [ballotStatus, setBallotStatus] = useState<'on-ballot' | 'not-yet'>(
    'not-yet',
  )
  const [budgetRaised, setBudgetRaised] = useState('')
  const [candidateHours, setCandidateHours] = useState('')
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [newVolunteerName, setNewVolunteerName] = useState('')
  const [newVolunteerHours, setNewVolunteerHours] = useState('')

  const budgetRaisedNum = Number.parseFloat(budgetRaised)
  const budgetValid = Number.isFinite(budgetRaisedNum) && budgetRaisedNum >= 0
  const budgetGap = budgetValid
    ? Math.max(0, plan.totalBudget - budgetRaisedNum)
    : null

  const candidateHoursNum = Number.parseFloat(candidateHours)
  const candidateHoursValid =
    Number.isFinite(candidateHoursNum) && candidateHoursNum >= 0
  const candidateHoursGap = candidateHoursValid
    ? Math.max(0, plan.candidateHoursPerWeek - candidateHoursNum)
    : null

  const totalVolunteerHours = volunteers.reduce(
    (sum, v) => sum + (Number.isFinite(v.hoursPerWeek) ? v.hoursPerWeek : 0),
    0,
  )
  const volunteerHoursGap = Math.max(
    0,
    plan.volunteerHoursPerWeek - totalVolunteerHours,
  )

  const handleAddVolunteer = () => {
    const name = newVolunteerName.trim()
    const hours = Number.parseFloat(newVolunteerHours)
    if (!name || !Number.isFinite(hours) || hours <= 0) return
    setVolunteers((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name,
        hoursPerWeek: hours,
      },
    ])
    setNewVolunteerName('')
    setNewVolunteerHours('')
  }

  const handleRemoveVolunteer = (id: string) => {
    setVolunteers((prev) => prev.filter((v) => v.id !== id))
  }

  return (
    <Card>
      <CardContent className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-foreground">
            Where you are
          </h2>
          <p className="text-sm text-muted-foreground">
            Tell us where things stand. We&apos;ll show you the gap to plan.
          </p>
        </div>

        <div className="space-y-2">
          <Label>Are you on the ballot yet?</Label>
          <RadioGroup
            value={ballotStatus}
            onValueChange={(v) =>
              setBallotStatus(v === 'on-ballot' ? 'on-ballot' : 'not-yet')
            }
            className="flex gap-6"
          >
            <Label
              htmlFor="ballot-on"
              className="flex cursor-pointer items-center gap-2"
            >
              <RadioGroupItem id="ballot-on" value="on-ballot" />
              <span className="text-sm text-foreground">Yes, I&apos;m on</span>
            </Label>
            <Label
              htmlFor="ballot-not-yet"
              className="flex cursor-pointer items-center gap-2"
            >
              <RadioGroupItem id="ballot-not-yet" value="not-yet" />
              <span className="text-sm text-foreground">Not yet</span>
            </Label>
          </RadioGroup>
          {ballotStatus === 'not-yet' && plan.filingDeadline ? (
            <Gap>
              Filing deadline:{' '}
              <span className="font-semibold text-foreground">
                {plan.filingDeadline}
              </span>
              . File before this date.
            </Gap>
          ) : null}
          {ballotStatus === 'on-ballot' ? (
            <Gap>You&apos;re cleared. Focus shifts to voter contact.</Gap>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="plan-budget-raised">
            How much have you raised so far?
          </Label>
          <Input
            id="plan-budget-raised"
            type="number"
            inputMode="decimal"
            min={0}
            step="1"
            placeholder="0"
            value={budgetRaised}
            onChange={(e) => setBudgetRaised(e.target.value)}
          />
          {budgetValid && budgetGap !== null ? (
            <Gap>
              {budgetGap === 0
                ? `You're at or above the ${formatDollars(
                    plan.totalBudget,
                  )} target. Nice.`
                : `Plan target: ${formatDollars(
                    plan.totalBudget,
                  )}. You need ${formatDollars(budgetGap)} more.`}
            </Gap>
          ) : (
            <Gap>
              Plan target:{' '}
              <span className="font-semibold text-foreground">
                {formatDollars(plan.totalBudget)}
              </span>
            </Gap>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="plan-candidate-hours">
            Your canvassing hours per week
          </Label>
          <Input
            id="plan-candidate-hours"
            type="number"
            inputMode="numeric"
            min={0}
            step="1"
            placeholder="0"
            value={candidateHours}
            onChange={(e) => setCandidateHours(e.target.value)}
          />
          {candidateHoursValid && candidateHoursGap !== null ? (
            <Gap>
              {candidateHoursGap === 0
                ? `You're at the ${plan.candidateHoursPerWeek}-hour target. Nice.`
                : `Plan target: ${plan.candidateHoursPerWeek} hrs/week. You're ${candidateHoursGap} short.`}
            </Gap>
          ) : (
            <Gap>
              Plan target:{' '}
              <span className="font-semibold text-foreground">
                {plan.candidateHoursPerWeek} hrs/week
              </span>
            </Gap>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <Label>Your volunteers</Label>
            <p className="mt-1 text-xs text-muted-foreground">
              Plan needs about{' '}
              <span className="font-semibold text-foreground">
                {plan.volunteerHoursPerWeek} volunteer hrs/week
              </span>{' '}
              to cover the doors you can&apos;t.
            </p>
          </div>

          {volunteers.length > 0 ? (
            <ul className="divide-y divide-base-border rounded-xl border border-base-border">
              {volunteers.map((v) => (
                <li
                  key={v.id}
                  className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-foreground">{v.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {v.hoursPerWeek} hrs/week
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveVolunteer(v.id)}
                    aria-label={`Remove ${v.name}`}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_120px_auto]">
            <Input
              type="text"
              placeholder="Volunteer name"
              value={newVolunteerName}
              onChange={(e) => setNewVolunteerName(e.target.value)}
            />
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              step="1"
              placeholder="Hrs/week"
              value={newVolunteerHours}
              onChange={(e) => setNewVolunteerHours(e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              icon={<Plus className="size-4" />}
              onClick={handleAddVolunteer}
            >
              Add
            </Button>
          </div>

          <Gap>
            {volunteerHoursGap === 0
              ? `You have ${totalVolunteerHours} volunteer hrs/week. You're at target.`
              : `You have ${totalVolunteerHours} volunteer hrs/week. You need ${volunteerHoursGap} more.`}
          </Gap>
        </div>
      </CardContent>
    </Card>
  )
}

export default PlanInputs
