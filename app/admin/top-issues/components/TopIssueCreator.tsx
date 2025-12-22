'use client'
import { useTopIssues } from './UseTopIssuesContext'
import { useState, ChangeEvent } from 'react'
import TextField from '@shared/inputs/TextField'
import { FaCaretDown, FaCaretRight } from 'react-icons/fa'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import { useSnackbar } from 'helpers/useSnackbar'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

interface TopIssue {
  id: number
  name: string
  positions?: { id: number; name: string }[]
}

export const createTopIssue = async (name: string): Promise<TopIssue> => {
  const payload = {
    name,
  }
  const resp = await clientFetch<TopIssue>(apiRoutes.topIssue.create, payload)
  return resp.data
}

export const TopIssueCreator = (): React.JSX.Element => {
  const [topIssues, setTopIssues] = useTopIssues()
  const { successSnackbar } = useSnackbar()
  const [addNewIssue, setAddNewIssue] = useState(false)
  const [topIssueName, setTopIssueName] = useState('')

  const handleCreate = async () => {
    successSnackbar('creating issue')
    setTopIssues([await createTopIssue(topIssueName), ...topIssues])
    setAddNewIssue(false)
    setTopIssueName('')
  }

  return (
    <>
      <PrimaryButton
        onClick={() => {
          setAddNewIssue(!addNewIssue)
        }}
        className="font-black align-middle"
      >
        Add a Top Issue{' '}
        {addNewIssue ? (
          <FaCaretDown className="inline-block" />
        ) : (
          <FaCaretRight className="inline-block" />
        )}
      </PrimaryButton>

      {addNewIssue && (
        <div className="flex mt-4 items-center">
          <TextField
            className="mx-4"
            fullWidth
            label="Top Issue Name"
            value={topIssueName}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setTopIssueName(e.target.value)
            }
          />
          <div className="text-right">
            <PrimaryButton
              disabled={topIssueName === ''}
              onClick={handleCreate}
              className="font-black"
            >
              Save
            </PrimaryButton>
          </div>
        </div>
      )}
    </>
  )
}
