import { useMemo, useState, FormEvent } from 'react'
import TextField from '@shared/inputs/TextField'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@styleguide'
import { Button } from '@styleguide'
import { RunningAgainst } from 'helpers/types'

const partyOptions = [
  'Independent',
  'Democrat Party',
  'Republican Party',
  'Green Party',
  'Libertarian Party',
  'Forward Party',
  'Other',
]

interface RunningAgainstFormProps {
  name?: string
  party?: string
  description?: string
  onSave: (values: RunningAgainst) => void
  onCancel: () => void
  className?: string
}

export default function RunningAgainstForm({
  name = '',
  party = '',
  description = '',
  onSave,
  onCancel,
  className = '',
}: RunningAgainstFormProps): React.JSX.Element {
  const [state, setState] = useState<RunningAgainst>({
    name,
    party,
    description,
  })
  const isNew = useMemo(
    () => name === '' && party === '' && description === '',
    [name, party, description],
  )
  const canSave = useMemo(
    () => state.name != '' && state.party != '' && state.description != '',
    [state],
  )

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault()

    onSave(state)

    if (isNew) setState({ name, party, description })
  }

  function handleCancel(): void {
    onCancel()
  }

  function handleChangeField(
    fieldName: keyof RunningAgainst,
    fieldValue: string,
  ): void {
    setState((current) => ({
      ...current,
      [fieldName]: fieldValue,
    }))
  }

  return (
    <form className={'w-full ' + className} onSubmit={handleSubmit}>
      <TextField
        label="Name"
        fullWidth
        required
        value={state.name}
        onChange={(e) => {
          handleChangeField('name', e.target.value)
        }}
      />
      <div className="mt-6">
        <Select
          value={state.party}
          required
          onValueChange={(val) => {
            handleChangeField('party', val)
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Opponent Party" />
          </SelectTrigger>
          <SelectContent>
            {partyOptions.map((op) => (
              <SelectItem value={op} key={op}>
                {op}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6">
        <TextField
          label="Describe them"
          placeholder="EXAMPLE: Republican hotel owner"
          multiline
          rows={6}
          fullWidth
          required
          value={state.description}
          onChange={(e) => {
            handleChangeField('description', e.target.value)
          }}
        />
      </div>

      <div className="flex gap-2 mt-4">
        <Button
          variant="secondary"
          size="small"
          type="button"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button size="small" type="submit" disabled={!canSave}>
          {isNew ? 'Add Opponent' : 'Finish Editing'}
        </Button>
      </div>
    </form>
  )
}
