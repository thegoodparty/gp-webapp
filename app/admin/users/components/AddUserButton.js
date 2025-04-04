'use client'
import { useSnackbar } from 'helpers/useSnackbar'
import { useState } from 'react'
import { isValidEmail } from 'helpers/validations'
import Button from '@shared/buttons/Button'
import Modal from '@shared/utils/Modal'
import H2 from '@shared/typography/H2'
import TextField from '@shared/inputs/TextField'
import { MenuItem, Select } from '@mui/material'
import { USER_ROLES, userHasRole } from 'helpers/userHelper'
import { ModalFooter } from '@shared/ModalFooter'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'

const createNewUser = async ({ firstName, lastName, email, role }) => {
  try {
    const resp = await clientFetch(apiRoutes.admin.user.create, {
      firstName,
      lastName,
      email,
      roles: [role],
    })
    const user = resp.data
    if (user) {
      return user
    }
    return false
  } catch (e) {
    console.error('error', e)
    return false
  }
}

export const sendSetPasswordEmail = async (userId) => {
  try {
    const payload = {
      userId,
    }
    return await clientFetch(
      apiRoutes.authentication.setSetPasswordEmail,
      payload,
    )
  } catch (e) {
    console.error('error', e)
    return false
  }
}

export const AddUserButton = ({ onClick = () => {} }) => {
  const { successSnackbar, errorSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [role, setRole] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')

  const openModal = () => setModalOpen(true)
  const closeModal = () => setModalOpen(false)

  const handleOnClick = () => {
    openModal()
    onClick()
  }

  const handleSubmit = async () => {
    setLoading(true)
    const newUser = await createNewUser({
      firstName,
      lastName,
      email,
      role,
    })
    setLoading(false)
    if (!newUser) {
      errorSnackbar('Error creating new user')
      return
    }

    if (userHasRole(newUser, USER_ROLES.SALES)) {
      // send set password email
      sendSetPasswordEmail(newUser.id)
    }
    successSnackbar('User created successfully')
    closeModal()
    window.location.reload()
  }

  const emailIsValid = email !== '' && isValidEmail(email)

  const formValid =
    emailIsValid && role !== '' && firstName !== '' && lastName !== ''

  return (
    <>
      <Button onClick={handleOnClick} color="success">
        Add User
      </Button>
      <Modal
        boxClassName="w-[95vw] md:w-auto"
        open={modalOpen}
        closeCallback={() => setModalOpen(false)}
      >
        <H2 className="text-center mb-4">Add User</H2>
        <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
          <TextField
            className="w-full"
            label="First Name"
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            className="w-full"
            label="Last Name"
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <TextField
          className="w-full mb-2"
          label="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Select
          className="w-full"
          value={role}
          displayEmpty
          onChange={(e) => setRole(e.target.value)}
          InputProps={{ className: 'capitalize' }}
        >
          <MenuItem value="">Select</MenuItem>
          {Object.values(USER_ROLES).map((role) => (
            <MenuItem className="capitalize" value={role} key={role}>
              <span className="capitalize">{role}</span>
            </MenuItem>
          ))}
        </Select>
        <ModalFooter
          onBack={closeModal}
          onNext={handleSubmit}
          disabled={!formValid || loading}
          nextButtonProps={{ loading }}
          nextText="Add User"
          backText="Cancel"
        />
      </Modal>
    </>
  )
}
