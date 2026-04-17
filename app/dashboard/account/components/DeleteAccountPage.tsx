'use client'

import { useState } from 'react'
import { useClerk } from '@clerk/nextjs'
import { useUser } from '@shared/hooks/useUser'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import Modal from '@shared/utils/Modal'

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
      const resp = await clientFetch(apiRoutes.user.deleteAccount, { id: user.id })

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
      <button
        className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded"
        onClick={() => {
          setError(null)
          setModalOpen(true)
        }}
      >
        Delete Account
      </button>

      <Modal
        open={modalOpen}
        closeCallback={() => {
          if (!loading) setModalOpen(false)
        }}
        preventBackdropClose={loading}
        preventEscClose={loading}
      >
        <h3 className="text-lg font-semibold mb-2">Are you sure?</h3>
        <p className="text-gray-600 mb-4">
          This cannot be undone. All your campaign data will be permanently
          deleted.
        </p>
        {error && (
          <p role="alert" className="text-red-600 text-sm mb-4">
            {error}
          </p>
        )}
        <div className="flex gap-3 justify-end">
          <button
            className="px-4 py-2 border rounded font-medium"
            onClick={() => setModalOpen(false)}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium px-4 py-2 rounded"
            onClick={handleDeleteConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete My Account'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
