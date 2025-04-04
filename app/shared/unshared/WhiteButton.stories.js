import WhiteButton from 'app/(landing)/run-for-office/components/WhiteButton'

export default {
  title: 'Unshared/WhiteButton',
  component: WhiteButton,
  tags: ['autodocs'],
  args: {
    label: 'White Button',
  },
  render: (args) => {
    return (
      <>
        <strong>(Used in run for office page)</strong>
        <br />
        <WhiteButton {...args} />
      </>
    )
  },
}

export const Default = {}
