'use client'

import { useState } from 'react'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from '@styleguide'
import {
  Briefcase,
  Check,
  Compass,
  DollarSign,
  Footprints,
  Megaphone,
  Sparkles,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  roleLabels,
  type Question,
  type Role,
} from '../presets'
import SuggestionCard from './SuggestionCard'

type Props = {
  questions: Question[]
  answers: Record<string, string[]>
  onAnswer: (question: Question, optionId: string) => void
}

const roleIcons: Record<Role, LucideIcon> = {
  manager: Briefcase,
  field: Footprints,
  political: Compass,
  comms: Megaphone,
  finance: DollarSign,
}

export default function CheckInCard({
  questions,
  answers,
  onAnswer,
}: Props): React.JSX.Element {
  const [followUpValues, setFollowUpValues] = useState<Record<string, string>>(
    {},
  )
  const [followUpSaved, setFollowUpSaved] = useState<Record<string, string>>({})
  const [followUpChoices, setFollowUpChoices] = useState<
    Record<string, string>
  >({})

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center gap-2">
        <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Sparkles className="size-4" aria-hidden />
        </span>
        <CardTitle className="text-lg">Weekly Check-In</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {questions.map((q, index) => {
          const selectedIds = answers[q.id] ?? []
          const selectedOptions = q.options.filter((o) =>
            selectedIds.includes(o.id),
          )
          const isMulti = q.multiSelect === true
          const selectedOption = !isMulti ? selectedOptions[0] : undefined
          const RoleIcon = roleIcons[q.role]

          return (
            <div key={q.id} className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                  {index + 1}
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
                    <RoleIcon className="size-3.5" aria-hidden />
                    <span>{roleLabels[q.role]}</span>
                  </div>
                  <p className="text-base font-medium text-foreground">
                    {q.prompt}
                  </p>
                  {q.detail && (
                    <p className="break-all font-mono text-xs text-muted-foreground">
                      {q.detail}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pl-9">
                {q.options.map((option) => {
                  const isSelected = selectedIds.includes(option.id)
                  return (
                    <Button
                      key={option.id}
                      type="button"
                      variant={isSelected ? 'default' : 'outline'}
                      size="small"
                      onClick={() => onAnswer(q, option.id)}
                      aria-pressed={isSelected}
                    >
                      {isSelected && <Check className="size-3.5" aria-hidden />}
                      {option.label}
                    </Button>
                  )
                })}
              </div>
              {isMulti && selectedOptions.length > 0 && (
                <div className="ml-9 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm text-foreground">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    What happened
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {selectedOptions.map((opt) => (
                      <li key={opt.id} className="text-foreground">
                        <span className="font-medium">{opt.label}.</span>{' '}
                        {opt.impact}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {!isMulti && selectedOption && (
                <div className="ml-9 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm text-foreground">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    What happened
                  </p>
                  <p className="mt-1 text-foreground">{selectedOption.impact}</p>
                </div>
              )}
              {selectedOption?.spawn && (
                <div className="ml-9">
                  <SuggestionCard suggestion={selectedOption.spawn} />
                </div>
              )}
              {selectedOption?.followUpChoice &&
                (() => {
                  const choice = selectedOption.followUpChoice
                  const chosenId = followUpChoices[q.id]
                  const chosenOption = chosenId
                    ? choice.options.find((o) => o.id === chosenId)
                    : undefined
                  return (
                    <div className="ml-9 rounded-xl border border-border bg-background p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Recommendation
                      </p>
                      <p className="mt-2 text-sm font-medium text-foreground">
                        {choice.label}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {choice.options.map((opt) => {
                          const isPicked = chosenId === opt.id
                          return (
                            <Button
                              key={opt.id}
                              type="button"
                              variant={isPicked ? 'default' : 'outline'}
                              size="small"
                              onClick={() =>
                                setFollowUpChoices((prev) => ({
                                  ...prev,
                                  [q.id]: opt.id,
                                }))
                              }
                              aria-pressed={isPicked}
                            >
                              {isPicked && (
                                <Check className="size-3.5" aria-hidden />
                              )}
                              {opt.label}
                            </Button>
                          )
                        })}
                      </div>
                      {chosenOption && (
                        <p className="mt-3 text-sm text-foreground">
                          {chosenOption.impact}
                        </p>
                      )}
                    </div>
                  )
                })()}
              {selectedOption?.followUp &&
                (() => {
                  const followUp = selectedOption.followUp
                  const draft = followUpValues[q.id] ?? ''
                  const saved = followUpSaved[q.id]
                  const canSave = draft.trim().length > 0 && draft !== saved
                  const handleSave = () => {
                    if (!canSave) return
                    setFollowUpSaved((prev) => ({ ...prev, [q.id]: draft }))
                  }
                  return (
                    <div className="ml-9 rounded-xl border border-border bg-background p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Recommendation
                      </p>
                      <label
                        htmlFor={`followup-${q.id}`}
                        className="mt-2 block text-sm font-medium text-foreground"
                      >
                        {followUp.label}
                      </label>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="relative flex-1">
                          {followUp.prefix && (
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
                              {followUp.prefix}
                            </span>
                          )}
                          <Input
                            id={`followup-${q.id}`}
                            inputMode={followUp.prefix ? 'decimal' : 'url'}
                            placeholder={followUp.placeholder}
                            value={draft}
                            onChange={(e) =>
                              setFollowUpValues((prev) => ({
                                ...prev,
                                [q.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                handleSave()
                              }
                            }}
                            className={followUp.prefix ? 'pl-7' : undefined}
                          />
                        </div>
                        <Button
                          type="button"
                          size="small"
                          onClick={handleSave}
                          disabled={!canSave}
                        >
                          {followUp.actionLabel ?? 'Save'}
                        </Button>
                      </div>
                      {saved && (
                        <p className="mt-2 flex items-center gap-1.5 text-xs text-foreground">
                          <Check className="size-3.5 text-primary" aria-hidden />
                          Saved: {followUp.prefix ?? ''}
                          {saved}
                        </p>
                      )}
                    </div>
                  )
                })()}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
