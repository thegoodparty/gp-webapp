'use client'
import { useState } from 'react'
import Button from '@shared/buttons/Button'
import AlertDialog from '@shared/utils/AlertDialog'
import { USER_ROLES } from 'helpers/userHelper'
import { sendSetPasswordEmail } from 'app/admin/shared/sendSetPasswordEmail'

interface User {
  id: number
  email: string
  firstName?: string
  lastName?: string
  roles?: string[]
}

interface ResendPasswordEmailActionProps {
  user: User
}

export default function ResendPasswordEmailAction({
  user,
}: ResendPasswordEmailActionProps): React.JSX.Element {
  const { id: userId, email, firstName, lastName, roles } = user
  const [dialogOpen, setDialogOpen] = useState(false)

  if (!roles?.includes(USER_ROLES.SALES)) return <></>

  const handleClick = () => {
    setDialogOpen(true)
  }

  const handleProceed = () => {
    sendSetPasswordEmail(userId)
    setDialogOpen(false)
  }

  return (
    <>
      <div className="my-3">
        <Button
          onClick={handleClick}
          size="small"
          className="w-full"
          color="info"
        >
          <span className="whitespace-nowrap">Resend Password Email</span>
        </Button>
      </div>
      <AlertDialog
        open={dialogOpen}
        handleClose={() => {
          setDialogOpen(false)
        }}
        redButton={false}
        title="Resend Set Password Email"
        description={`This will send a new set password email to ${firstName} ${lastName} at ${email}`}
        handleProceed={handleProceed}
      />
    </>
  )
}
