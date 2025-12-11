import { useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import gpApi from 'gpApi'
import gpFetch from 'gpApi/gpFetch'
import DeleteAction from './DeleteAction'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import { revalidateCandidates, revalidatePage } from 'helpers/cacheHelper'
import { useSnackbar } from 'helpers/useSnackbar'

async function reactivate(id: number) {
  try {
    const api = gpApi.admin.reactivateCandidate
    const payload = {
      id,
    }
    return await gpFetch(api, payload)
  } catch (e) {
    console.error('error', e)
    return false
  }
}

interface ActionsProps {
  id: number
  campaignOnboardingSlug: string | null
  isActive: boolean
}

export default function Actions({ id, campaignOnboardingSlug, isActive }: ActionsProps): React.JSX.Element {
  const [showMenu, setShowMenu] = useState(false)
  const { successSnackbar } = useSnackbar()

  const reactivateCandidate = async () => {
    successSnackbar('reactivating candidate')
    await reactivate(id)
    successSnackbar('Reactivated')
    await revalidateCandidates()
    await revalidatePage('/admin/all-candidates')
    await revalidatePage('/admin/candidates')
    window.location.reload()
  }

  return (
    <div className="flex justify-center relative">
      <BsThreeDotsVertical
        onClick={() => {
          setShowMenu(!showMenu)
        }}
        className=" text-xl cursor-pointer"
      />
      {showMenu && (
        <>
          <div
            className="fixed h-screen w-screen top-14 left-0"
            onClick={() => {
              setShowMenu(false)
            }}
          />

          <div className="absolute bg-white px-4 py-3 rounded-xl shadow-lg z-10 left-24 top-3">
            {campaignOnboardingSlug && !isActive && (
              <div className="my-3" onClick={reactivateCandidate}>
                <PrimaryButton size="small">Reactivate</PrimaryButton>
              </div>
            )}
            <DeleteAction id={id} />
          </div>
        </>
      )}
    </div>
  )
}
