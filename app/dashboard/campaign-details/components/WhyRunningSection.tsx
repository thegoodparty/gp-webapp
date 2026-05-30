'use client'

import H3 from '@shared/typography/H3'
import Body1 from '@shared/typography/Body1'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import { Alert, AlertDescription, CircleAlertIcon } from '@styleguide'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getUserWebsite,
  saveAboutFields,
  USER_WEBSITE_QUERY_KEY,
} from 'app/dashboard/website/util/website.util'
import { useSnackbar } from 'helpers/useSnackbar'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import { Website } from 'helpers/types'
import {
  MIN_BIO_LENGTH,
  getBioError,
  getBioPlainLength,
} from 'app/dashboard/profile/texting-compliance/candidate-profile/candidateProfile.utils'

const RichEditor = dynamic(() => import('app/shared/utils/RichEditor'), {
  ssr: false,
  loading: () => (
    <div className="rounded-md border border-input bg-white px-3 py-2 text-sm text-muted-foreground">
      Loading editor…
    </div>
  ),
})

export default function WhyRunningSection(): React.JSX.Element {
  const queryClient = useQueryClient()
  const { errorSnackbar, successSnackbar } = useSnackbar()
  const { data: website } = useQuery<Website | null>({
    queryKey: USER_WEBSITE_QUERY_KEY,
    queryFn: getUserWebsite,
  })

  const [bio, setBio] = useState('')
  const [bioPlainLength, setBioPlainLength] = useState(0)
  const [saving, setSaving] = useState(false)
  // `initialBio` must be captured exactly once and never change afterward.
  // RichEditor re-pastes its content whenever `initialText` changes by value,
  // so if we derived it live from the query it would clobber the user's
  // in-progress edits whenever `invalidateQueries` (after save) triggers a
  // refetch. `null` means "not seeded yet" so we can defer mounting the
  // editor until we have the real value.
  const [initialBio, setInitialBio] = useState<string | null>(null)
  // The Save button is always enabled so the user can attempt to save and get
  // a guiding error rather than a silently-disabled button. The error (alert +
  // red bio border) only surfaces once they've tried to save.
  const [attemptedSave, setAttemptedSave] = useState(false)
  const seededRef = useRef(false)

  useEffect(() => {
    if (seededRef.current || !website) return
    const initial = website.content?.about?.bio ?? ''
    setBio(initial)
    // Seed length up-front so Save isn't falsely disabled before the editor
    // emits its first onTextLengthChange.
    setBioPlainLength(getBioPlainLength(initial))
    setInitialBio(initial)
    seededRef.current = true
  }, [website])

  const bioError = getBioError(bioPlainLength)

  const handleSave = async () => {
    if (saving) return
    if (bioError) {
      setAttemptedSave(true)
      return
    }
    trackEvent(EVENTS.Profile.WhyRunning.ClickSave)
    setSaving(true)
    const ok = await saveAboutFields({ bio })
    if (!ok) {
      errorSnackbar('Failed to save. Please try again.')
      setSaving(false)
      return
    }
    await queryClient.invalidateQueries({ queryKey: USER_WEBSITE_QUERY_KEY })
    successSnackbar('Bio saved')
    setSaving(false)
  }

  return (
    <section>
      <H3>Why are you running?</H3>
      <Body1 className="text-gray-600 mt-2 pb-6 mb-6">
        Tell potential voters why you&apos;re running for office.
      </Body1>
      {attemptedSave && bioError && (
        <Alert
          variant="destructive"
          icon={<CircleAlertIcon />}
          className="mb-4"
        >
          <AlertDescription>{bioError}</AlertDescription>
        </Alert>
      )}
      {initialBio !== null && (
        <RichEditor
          initialText={initialBio}
          onChangeCallback={setBio}
          onTextLengthChange={setBioPlainLength}
          error={attemptedSave && !!bioError}
        />
      )}
      <div className="mt-1.5 flex justify-between text-xs text-muted-foreground">
        <span>{MIN_BIO_LENGTH} character minimum</span>
        <span>{bioPlainLength}</span>
      </div>
      <div className="flex justify-end mt-6">
        <PrimaryButton loading={saving} disabled={saving} onClick={handleSave}>
          {saving ? 'Saving...' : 'Save'}
        </PrimaryButton>
      </div>
    </section>
  )
}
