'use client'

import { useState } from 'react'
import { useClerk } from '@clerk/nextjs'
import { useUser } from '@shared/hooks/useUser'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { buttonVariants } from 'styleguide/components/ui/button'
import {
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  Button,
} from 'styleguide/components/ui'

export default function DeleteAccountPage(): React.JSX.Element {
  const [user] = useUser()
  const { signOut } = useClerk()
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDeleteConfirm = async () => {
    if (!user?.id) return
    setLoading(true)
    setError(null)

    try {
      const resp = await clientFetch(apiRoutes.user.deleteAccount, {
        id: user.id,
      })

      if (resp.ok || resp.status === 404) {
        await signOut({ redirectUrl: '/' })
        return
      }

      setError(
        'Failed to delete your account. Please try again or contact support.',
      )
    } catch {
      setError(
        'An unexpected error occurred. Please try again or contact support.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-lg">
      <h2 className="text-xl font-semibold mb-2">Delete Account</h2>
      <p className="text-gray-600 mb-6">
        Permanently delete your account and all associated campaign data.
      </p>
      <Button
        variant="destructive"
        className="px-4 py-2"
        onClick={() => {
          setError(null)
          setModalOpen(true)
        }}
      >
        Delete Account
      </Button>

      <AlertDialog
        open={modalOpen}
        onOpenChange={(open) => {
          if (!loading) setModalOpen(open)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone. All your campaign data will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: 'destructive' })}
              onClick={handleDeleteConfirm}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete My Account'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
