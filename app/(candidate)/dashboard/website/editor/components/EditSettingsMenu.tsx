'use client'
import { useEffect, useState } from 'react'
import { LuSettings } from 'react-icons/lu'
import Button from '@shared/buttons/Button'
import { updateWebsite } from '../../util/website.util'
import { useSnackbar } from 'helpers/useSnackbar'
import { useRouter } from 'next/navigation'
import { WEBSITE_STATUS } from '../../util/website.util'
import AlertDialog from '@shared/utils/AlertDialog'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'

const EditSettingsMenu = (): React.JSX.Element => {
  const router = useRouter()
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { errorSnackbar, successSnackbar } = useSnackbar()
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      const target = event.target
      if (settingsMenuOpen && target instanceof Element && !target.closest('.settings-menu')) {
        setSettingsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [settingsMenuOpen])

  const handleUnpublish = async () => {
    setLoading(true)
    const resp = await updateWebsite({
      status: WEBSITE_STATUS.unpublished,
    })

    setLoading(false)
    if (resp && resp.ok) {
      trackEvent(EVENTS.CandidateWebsite.Unpublished)
      successSnackbar('Website has been unpublished')
      setSettingsMenuOpen(false)
      router.push('/dashboard/website')
    } else {
      console.error('Failed to unpublish website', resp)
      errorSnackbar('Failed to unpublish website')
    }

    return resp && resp.ok
  }

  return (
    <div className="relative settings-menu">
      <Button
        variant="text"
        onClick={() => setSettingsMenuOpen(!settingsMenuOpen)}
      >
        <LuSettings size={24} />
      </Button>

      {settingsMenuOpen && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[160px]">
          <Button
            variant="text"
            onClick={() => setConfirmOpen(true)}
            disabled={loading}
            loading={loading}
            className="w-full"
            size="small"
          >
            Unpublish
          </Button>
        </div>
      )}
      <AlertDialog
        open={confirmOpen}
        handleClose={() => setConfirmOpen(false)}
        handleProceed={handleUnpublish}
        onCancel={() => setConfirmOpen(false)}
        cancelLabel="Cancel"
        proceedLabel="Unpublish"
        title="Unpublish Website"
        description="Are you sure you want to unpublish your website?"
      />
    </div>
  )
}

export default EditSettingsMenu
