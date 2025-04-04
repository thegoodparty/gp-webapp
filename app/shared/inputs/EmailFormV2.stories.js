import EmailFormV2 from './EmailFormV2'

export default {
  title: 'Inputs/EmailFormV2',
  component: EmailFormV2,
  tags: ['autodocs'],
  args: {
    formId: '123',
    placeholder: 'Enter your email to subscribe',
  },
  parameters: {
    backgrounds: {
      default: 'Medium',
    },
  },
}

export const Default = {}
export const PrimaryButton = {
  args: {
    primaryButton: true,
  },
}
