'use client'

import PrimaryButton from '@shared/buttons/PrimaryButton'
import H2 from '@shared/typography/H2'
import Modal from '@shared/utils/Modal'
import { buildTrackingAttrs } from 'helpers/fullStoryHelper'
import { useEffect, useMemo, useState } from 'react'
import TextField from '@shared/inputs/TextField'

export default function InputFieldsModal({
  onSelectCallback,
  closeModalCallback,
  showModal,
  inputFields,
  inputValues,
  selected,
}) {
  const [inputState, setInputState] = useState({})

  const trackingAttrs = useMemo(
    () =>
      buildTrackingAttrs('Generate AI Content Additional Fields Submit', {
        key: selected,
      }),
    [selected],
  )

  useEffect(() => {
    if (inputValues) {
      setInputState(inputValues)
    }
  }, [inputValues])

  const onChangeField = (key, value) => {
    setInputState({
      ...inputState,
      [key]: value,
    })
  }

  const handleCreate = () => {
    if (!canCreate) {
      return
    }
    let additionalPrompt = 'additional info:\n'
    let inputValues = {}
    inputFields.forEach((field) => {
      additionalPrompt += `${field.title}: ${inputState[field.title]}\n`
      inputValues[field.title] = inputState[field.title]
    })

    additionalPrompt += inputState.hasOwnProperty('Additional instructions')
      ? inputState['Additional instructions']
      : ''

    inputValues['Additional instructions'] = inputState.hasOwnProperty(
      'Additional instructions',
    )
      ? inputState['Additional instructions']
      : ''

    onSelectCallback(additionalPrompt, inputValues)
    closeModalCallback()
    setInputState({})
  }

  const canCreate = () => {
    for (let i = 0; i < inputFields.length; i++) {
      const field = inputFields[i]
      if (!inputState[field.title] || inputState[field.title] === '') {
        return false
      }
    }
    return true
  }

  return (
    <Modal
      closeCallback={closeModalCallback}
      open={showModal}
      preventBackdropClose={true}
    >
      <div className="lg:min-w-[400px] max-w-lg">
        <H2 className="pb-5 mb-5 border-b border-slate-500 text-center">
          Additional Inputs
        </H2>
        {inputFields.map((field) => (
          <div className="mb-6" key={field.title}>
            <TextField
              required
              type={field.isDate ? 'date' : 'text'}
              label={field.title}
              helperText={field.helperText}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={
                inputState && inputState[field.title]
                  ? inputState[field.title]
                  : ''
              }
              onChange={(e) => {
                onChangeField(field.title, e.target.value)
              }}
            />
          </div>
        ))}
        <TextField
          type="text"
          label="Additional instructions"
          helperText="you can ask anything here"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          value={
            inputState && inputState['Additional instructions'] !== ''
              ? inputState['Additional instructions']
              : ''
          }
          onChange={(e) => {
            onChangeField('Additional instructions', e.target.value)
          }}
        />
        <div className="flex justify-center mt-6">
          <div onClick={handleCreate} {...trackingAttrs}>
            <PrimaryButton disabled={!canCreate()}>Create</PrimaryButton>
          </div>
        </div>
      </div>
    </Modal>
  )
}
