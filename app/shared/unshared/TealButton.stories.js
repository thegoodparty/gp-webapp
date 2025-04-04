import TealButton from 'app/candidate/[name]/[office]/components/TealButton'

export default {
  title: 'Unshared/TealButton',
  component: TealButton,
  tags: ['autodocs'],
  render: (args) => {
    return (
      <>
        <strong>(Used in candidate pages)</strong>
        <TealButton {...args}>Teal Button</TealButton>
      </>
    )
  },
}

export const Default = {}
