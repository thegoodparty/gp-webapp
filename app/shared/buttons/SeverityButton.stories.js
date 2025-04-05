import { SeverityButton } from './SeverityButton'

export default {
  title: 'Buttons/SeverityButton',
  component: SeverityButton,
  tags: ['autodocs'],
  args: {},
  render: (args) => (
    <div className="flex gap-3">
      <SeverityButton {...args}>Info Severity Button</SeverityButton>
      <SeverityButton {...args} severity="warning">
        Warning Severity Button
      </SeverityButton>
      <SeverityButton {...args} severity="error">
        Error Severity Button
      </SeverityButton>
      <SeverityButton {...args} severity="success">
        Success Severity Button
      </SeverityButton>
    </div>
  ),
}

export const Default = {}
