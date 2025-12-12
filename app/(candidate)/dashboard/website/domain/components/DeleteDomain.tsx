'use client'

import Button from '@shared/buttons/Button'
import { deleteDomain } from '../../util/domainFetch.util'

export default function DeleteDomain(): React.JSX.Element {
  const handleDelete = async () => {
    await deleteDomain()
    // refresh the page
    window.location.reload()
  }

  return <Button onClick={handleDelete}>Retry Registration</Button>
}
