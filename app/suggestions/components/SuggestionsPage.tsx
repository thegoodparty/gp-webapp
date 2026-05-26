'use client'

import { useMemo, useState } from 'react'
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@styleguide'
import {
  defaultPresetId,
  getPreset,
  presets,
  type Question,
  type SeedSuggestion,
} from '../presets'
import CheckInCard from './CheckInCard'
import SuggestionsList from './SuggestionsList'

export default function SuggestionsPage(): React.JSX.Element {
  const [presetId, setPresetId] = useState<string>(defaultPresetId)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})

  const preset = useMemo(() => getPreset(presetId), [presetId])

  const handleAnswer = (question: Question, optionId: string) => {
    setAnswers((prev) => {
      const current = prev[question.id] ?? []
      if (question.multiSelect) {
        const next = current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId]
        return { ...prev, [question.id]: next }
      }
      return { ...prev, [question.id]: [optionId] }
    })
  }

  const handleReset = () => {
    setAnswers({})
  }

  const handlePresetChange = (next: string) => {
    setPresetId(next)
    setAnswers({})
  }

  const suggestions: SeedSuggestion[] = useMemo(() => {
    const spawned: SeedSuggestion[] = []
    for (const q of preset.questions) {
      const ids = answers[q.id] ?? []
      for (const id of ids) {
        const option = q.options.find((o) => o.id === id)
        if (option?.spawn) spawned.push(option.spawn)
      }
    }
    return [...spawned, ...preset.seedSuggestions]
  }, [preset, answers])

  const answeredCount = Object.values(answers).filter(
    (arr) => arr.length > 0,
  ).length
  const questionCount = preset.questions.length

  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <div className="flex w-full flex-col items-start gap-4 border-b border-border bg-background px-6 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div className="flex min-w-0 flex-1 flex-col">
          <h1 className="text-base font-semibold text-foreground">
            Campaign Manager / Weekly Briefings
          </h1>
          <p className="text-sm font-normal text-muted-foreground">
            Your AI Campaign Manager checks in. Answer the questions to update
            your campaign or get pointed to the right resource.
          </p>
        </div>
        <div className="flex w-full flex-col items-end gap-3 sm:w-auto">
          <div className="flex w-full flex-col items-start gap-1 sm:w-auto">
            <label
              className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
              htmlFor="preset-select"
            >
              Demo preset
            </label>
            <Select value={presetId} onValueChange={handlePresetChange}>
              <SelectTrigger id="preset-select" className="w-64">
                <SelectValue placeholder="Pick a preset" />
              </SelectTrigger>
              <SelectContent>
                {presets.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>
              {answeredCount} / {questionCount} answered
            </span>
            {answeredCount > 0 && (
              <Button variant="outline" size="small" onClick={handleReset}>
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[860px] flex-col gap-6 px-4 pb-20 pt-6 lg:px-0">
        <section className="rounded-2xl border border-dashed border-border bg-background p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Why these questions
          </p>
          <p className="mt-2 text-sm text-foreground">{preset.rationale}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Audience:</span>{' '}
            {preset.audience}
          </p>
        </section>

        <CheckInCard
          questions={preset.questions}
          answers={answers}
          onAnswer={handleAnswer}
        />

        <div className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-foreground">
            From your campaign team
          </h2>
          <SuggestionsList suggestions={suggestions} />
        </div>
      </div>
    </div>
  )
}
