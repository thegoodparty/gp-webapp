'use client'

import { useState } from 'react'
import { Button } from '@styleguide'
import { clientRequest } from 'gpApi/typed-request'

type Props = {
  electedOfficeId: string
}

type Kind = 'schedule' | 'briefing'

const labels: Record<Kind, string> = {
  schedule: 'Trigger meeting_schedule',
  briefing: 'Trigger meeting_briefing',
}

export default function DevAgentTriggerBar({
  electedOfficeId,
}: Props): React.JSX.Element {
  const [pending, setPending] = useState<Kind | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const trigger = async (kind: Kind) => {
    setPending(kind)
    setMessage(null)
    try {
      await clientRequest('POST /v1/meetings/briefings/dispatch', {
        electedOfficeId,
        kind,
      })
      setMessage(`Dispatched ${kind} agent run`)
    } catch (err) {
      const detail =
        err instanceof Error
          ? (err as { data?: { message?: string } }).data?.message ??
            err.message
          : 'unknown error'
      setMessage(`Failed to dispatch ${kind}: ${detail}`)
    } finally {
      setPending(null)
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-dashed border-amber-500 bg-amber-50 p-3 text-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-amber-900">
          Dev tools — manual agent dispatch
        </span>
        <div className="flex gap-2">
          <Button
            size="small"
            variant="outline"
            disabled={pending !== null}
            onClick={() => trigger('schedule')}
          >
            {pending === 'schedule' ? 'Dispatching…' : labels.schedule}
          </Button>
          <Button
            size="small"
            variant="outline"
            disabled={pending !== null}
            onClick={() => trigger('briefing')}
          >
            {pending === 'briefing' ? 'Dispatching…' : labels.briefing}
          </Button>
        </div>
      </div>
      {message && <div className="text-xs text-amber-900">{message}</div>}
    </div>
  )
}
