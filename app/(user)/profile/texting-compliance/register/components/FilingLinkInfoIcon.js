import { useState } from 'react'
import { MdInfoOutline } from 'react-icons/md'
import Modal from '@shared/utils/Modal'
import H1 from '@shared/typography/H1'
import Body2 from '@shared/typography/Body2'
import Button from '@shared/buttons/Button'

export const FilingLinkInfoIcon = () => {
  const [open, setOpen] = useState(false)

  const handleIconClick = () => setOpen(true)
  const closeModal = () => setOpen(false)

  return (
    <>
      <MdInfoOutline
        onClick={handleIconClick}
        key="info"
        className="text-lg text-info h-6 w-6 cursor-pointer"
      />
      <Modal
        {...{
          open,
          closeCallback: closeModal,
        }}
      >
        <H1 className="mb-4">Election filing link</H1>
        <Body2 className="mb-4">
          You can usually find this website link by searching for your local
          Supervisor of Elections Office. Sometimes it can be your town, city or
          county. Search for the list of candidates running for office including
          yourself and paste that link here.
          <br />
          <br />
          Search term example: “Palm Bay, Florida Supervisor of Elections
          Candidate List”
        </Body2>
        <Button
          {...{
            color: 'neutral',
            size: 'large',
            className: 'flex-1 md:flex-initial w-full',
            onClick: closeModal,
          }}
        >
          Close
        </Button>
      </Modal>
    </>
  )
}
