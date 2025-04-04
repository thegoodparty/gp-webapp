import EmailForm from './EmailForm'

export default {
  title: 'Inputs/EmailForm',
  component: EmailForm,
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
