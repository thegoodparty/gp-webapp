import { useState } from 'react'
import Modal from './Modal'
import H1 from '@shared/typography/H1'
import Body1 from '@shared/typography/Body1'
import Button from '@shared/buttons/Button'

export default {
  title: 'Utils/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: {},
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>(open modal)</Button>
        <Modal open={open} closeCallback={() => setOpen(false)}>
          <H1>Modal Content</H1>
          <Body1>
            Non qui ad voluptate enim Lorem. Proident commodo quis cillum
            excepteur est enim sunt. Id est Lorem aute ipsum. Aute in duis
            occaecat est consequat eu esse quis adipisicing eiusmod. Irure
            aliquip fugiat non excepteur ea enim irure culpa incididunt.
            Deserunt ullamco exercitation eu proident occaecat nisi est veniam
            et dolore. Est ullamco est non sunt ad qui anim.
          </Body1>
        </Modal>
      </>
    )
  },
}

export const Default = {}
