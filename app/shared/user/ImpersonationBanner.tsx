'use client'

import { useClerk } from '@clerk/nextjs'
import { useIsImpersonating } from '@shared/hooks/useIsImpersonating'
import { useUser } from '@shared/hooks/useUser'
import { useSnackbar } from 'helpers/useSnackbar'
import { clientRequest } from 'gpApi/typed-request'
import { useState, useRef, useCallback } from 'react'
import { ArrowLeftRight, Ban } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@styleguide/components/ui/dialog'
import { Button } from '@styleguide/components/ui/button'
import { Input } from '@styleguide/components/ui/input'
import { cn } from '@styleguide/lib/utils'

const GP_ADMIN_URL = process.env.NEXT_PUBLIC_GP_ADMIN_URL ?? '/'

type SearchResult = { id: number; email: string; name: string | null }

export default function ImpersonationBanner() {
  const isImpersonating = useIsImpersonating()
  const { signOut, client, setActive } = useClerk()
  const [user] = useUser()
  const { errorSnackbar } = useSnackbar()

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [selected, setSelected] = useState<SearchResult | null>(null)
  const [swapping, setSwapping] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const handleSearch = useCallback((value: string) => {
    setQuery(value)
    setSelected(null)
    clearTimeout(debounceRef.current)
    if (!value.trim()) {
      setResults([])
      return
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const resp = await clientRequest('GET /v1/admin/users/search', {
          email: value,
        })
        if (resp.ok) {
          setResults(resp.data)
        }
      } finally {
        setSearching(false)
      }
    }, 300)
  }, [])

  async function handleSwap() {
    if (!selected) return
    setSwapping(true)
    try {
      const resp = await clientRequest(
        'POST /v1/admin/users/impersonate/:userId',
        { userId: String(selected.id) },
      )
      if (!resp.ok) {
        errorSnackbar('Failed to switch impersonation')
        return
      }
      const { token } = resp.data
      await signOut()
      const result = await client.signIn.create({
        strategy: 'ticket',
        ticket: token,
      })
      if (result.status !== 'complete' || !result.createdSessionId) {
        throw new Error('Impersonation sign-in incomplete')
      }
      await setActive({ session: result.createdSessionId })
      window.location.href = '/dashboard'
    } catch {
      errorSnackbar('Failed to switch impersonation')
    } finally {
      setSwapping(false)
    }
  }

  async function handleStopImpersonating() {
    await signOut()
    window.location.href = GP_ADMIN_URL
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      setQuery('')
      setResults([])
      setSelected(null)
    }
  }

  if (!isImpersonating) return null

  return (
    <>
      <div className="bg-amber-400 text-black px-4 py-2 text-center text-xs font-medium flex flex-col items-center gap-2">
        <span>
          You are impersonating <strong>{user?.email ?? 'this user'}</strong>
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="xSmall"
            onClick={() => setOpen(true)}
            className="bg-green-600 text-white border-green-600 hover:bg-green-700 hover:border-green-700"
          >
            <ArrowLeftRight />
            Switch User
          </Button>
          <Button variant="destructive" size="xSmall" onClick={handleStopImpersonating}>
            <Ban />
            Stop Impersonating
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Switch Impersonation</DialogTitle>
            <DialogDescription>
              Currently impersonating <strong>{user?.email}</strong>.<br />
              Search for a user to switch to.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              autoFocus
              placeholder="Search by email..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {searching && (
              <p className="text-sm text-muted-foreground">Searching...</p>
            )}
            {!searching && query && results.length === 0 && (
              <p className="text-sm text-muted-foreground">No user found</p>
            )}
            {results.length > 0 && (
              <div className="border rounded-md divide-y max-h-48 overflow-y-auto">
                {results.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelected(r)}
                    className={cn(
                      'w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors',
                      selected?.id === r.id && 'bg-primary/10 font-medium',
                    )}
                  >
                    <div className="truncate">{r.email}</div>
                    {r.name && (
                      <div className="text-muted-foreground text-xs truncate">
                        {r.name}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
            {selected && (
              <p className="text-sm text-muted-foreground break-all">
                Switching to: <strong className="text-foreground">{selected.email}</strong>
              </p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button
              disabled={!selected || swapping}
              loading={swapping}
              loadingText="Switching..."
              onClick={handleSwap}
              className="w-48"
            >
              Switch User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
