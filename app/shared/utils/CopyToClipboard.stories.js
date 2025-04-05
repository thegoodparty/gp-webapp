import CopyToClipboard from './CopyToClipboard'
import Snackbar from './Snackbar'

export default {
  title: 'Utils/CopyToClipboard',
  component: CopyToClipboard,
  tags: ['autodocs'],
  args: {
    children: <button>Click to copy text</button>,
    text: 'Copy this text',
  },
  render: (args) => (
    <>
      <Snackbar></Snackbar>
      <CopyToClipboard {...args} />
    </>
  ),
}

export const Default = {}
