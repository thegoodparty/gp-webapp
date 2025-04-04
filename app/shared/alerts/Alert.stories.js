import { StyledAlert } from './StyledAlert'

export default {
  title: 'Alerts/StyledAlert',
  component: StyledAlert,
  tags: ['autodocs'],
  args: {
    severity: 'success',
  },
  render: (args) => {
    return (
      <StyledAlert {...args}>
        <h4>Alert Box Here</h4>
        You have recieved an alert for some reason.
      </StyledAlert>
    )
  },
}

export const Success = {
  args: {
    severity: 'success',
  },
}
export const Info = {
  args: {
    severity: 'info',
  },
}
export const Warning = {
  args: {
    severity: 'warning',
  },
}
export const Error = {
  args: {
    severity: 'error',
  },
}
