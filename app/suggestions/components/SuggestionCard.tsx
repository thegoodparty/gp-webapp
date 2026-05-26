'use client'

import Link from 'next/link'
import { Badge, Card, CardContent } from '@styleguide'
import { ArrowRight, Sparkles, Star } from 'lucide-react'
import type { SeedSuggestion } from '../presets'

const sourceLabel: Record<SeedSuggestion['source'], string> = {
  preset: 'For your stage',
  answer: 'Based on your answer',
  validation: 'Going well',
}

const badgeVariant: Record<
  SeedSuggestion['source'],
  'default' | 'secondary'
> = {
  preset: 'secondary',
  answer: 'default',
  validation: 'secondary',
}

function GoldStar({
  className,
}: {
  className: string
}): React.JSX.Element {
  return (
    <Star
      className={`fill-yellow-400 text-yellow-400 ${className}`}
      aria-hidden
    />
  )
}

function ValidationDecoration(): React.JSX.Element {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
    >
      <Star className="absolute -top-6 -right-6 size-32 rotate-12 fill-yellow-200/70 text-yellow-200/70" />
      <Star className="absolute top-3 right-10 size-3 fill-yellow-400/80 text-yellow-400/80" />
      <Star className="absolute top-10 right-4 size-2 fill-yellow-500/80 text-yellow-500/80" />
      <Star className="absolute bottom-4 left-3 size-2.5 fill-yellow-300 text-yellow-300" />
      <Sparkles className="absolute bottom-10 right-6 size-3.5 text-yellow-400/80" />
    </div>
  )
}

export default function SuggestionCard({
  suggestion,
}: {
  suggestion: SeedSuggestion
}): React.JSX.Element {
  const s = suggestion
  const isExternal = s.action?.href.startsWith('http') ?? false

  const isValidation = s.source === 'validation'

  return (
    <Card
      className={`relative flex h-full flex-col overflow-hidden ${
        isValidation
          ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 via-yellow-100/40 to-background shadow-md ring-1 ring-yellow-200/60'
          : 'border-border'
      }`}
    >
      {isValidation && <ValidationDecoration />}
      <CardContent className="relative z-10 flex h-full flex-col gap-3 p-5">
        <Badge
          variant={badgeVariant[s.source]}
          className={
            isValidation
              ? 'gap-1 border-yellow-400/60 bg-yellow-200/80 text-yellow-900'
              : undefined
          }
        >
          {isValidation && <GoldStar className="size-3" />}
          {sourceLabel[s.source]}
        </Badge>
        <h3 className="flex items-start gap-1.5 text-base font-semibold leading-6 text-foreground">
          {s.title}
          {isValidation && <GoldStar className="mt-0.5 size-4 shrink-0" />}
        </h3>
        <p className="text-sm text-muted-foreground">{s.body}</p>
        {s.action && (
          <div className="mt-auto pt-2">
            <Link
              href={s.action.href}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className="inline-flex h-8 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              {s.action.label}
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
