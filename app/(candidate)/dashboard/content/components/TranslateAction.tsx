'use client'
import { useState } from 'react'
import Modal from '@shared/utils/Modal'
import { Select, MenuItem, SelectChangeEvent } from '@mui/material'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import SecondaryButton from '@shared/buttons/SecondaryButton'
import H2 from '@shared/typography/H2'
import H5 from '@shared/typography/H5'
import H6 from '@shared/typography/H6'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'

interface TranslateActionProps {
  showTranslate?: boolean
  setShowTranslate?: (show: boolean) => void
  handleTranslateCallback?: (language: string) => void
}

const TranslateAction = ({
  showTranslate,
  setShowTranslate,
  handleTranslateCallback,
}: TranslateActionProps): React.JSX.Element => {
  const [newLanguage, setNewLanguage] = useState('spanish')

  return (
    <>
      <Modal
        closeCallback={() => setShowTranslate?.(false)}
        open={showTranslate ?? false}
      >
        <div className="lg:min-w-[400px] max-w-md">
          <H2 className="pb-5 mb-5 border-b border-slate-500 text-center">
            Translate document
          </H2>
          <H5>
            Translating this document will create a new version of the document
            in the selected language. The original document will be preserved as
            a separate version.
          </H5>
          <H6 className="mt-14 mb-2">Language</H6>
          <Select
            required
            variant="outlined"
            defaultValue={'Spanish'}
            fullWidth
            onChange={(e: SelectChangeEvent) => {
              setNewLanguage(e.target.value)
            }}
          >
            <MenuItem value="Spanish">Spanish</MenuItem>
            <MenuItem value="French">French</MenuItem>
            <MenuItem value="German">German</MenuItem>
            <MenuItem value="Chinese">Chinese</MenuItem>
            <MenuItem value="Japanese">Japanese</MenuItem>
            <MenuItem value="Korean">Korean</MenuItem>
          </Select>
          <div className="mt-16 flex w-full justify-end">
            <div
              onClick={() => {
                setShowTranslate?.(false)
              }}
            >
              <SecondaryButton>Cancel</SecondaryButton>
            </div>
            <div
              className="ml-3"
              onClick={() => {
                setShowTranslate?.(false)
                trackEvent(EVENTS.ContentBuilder.Editor.SubmitTranslate, {
                  language: newLanguage,
                })
                handleTranslateCallback?.(newLanguage)
              }}
            >
              <PrimaryButton
                disabled={newLanguage.length === 0 || newLanguage.length >= 50}
              >
                Translate
              </PrimaryButton>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default TranslateAction
