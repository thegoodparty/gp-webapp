import ChipComponent from './Chip'
import { FaBeer, FaCoffee } from 'react-icons/fa'

const Component1 = () => <span key="derp">Default</span>
const Component2 = () => <h1 key="dap">Dap</h1>

export default {
  title: 'Utils/Chip',
  component: ChipComponent,
  tags: ['autodocs'],
  argTypes: {
    children: {
      options: ['Component1', 'Component2'],
      control: {
        type: 'select',
        labels: {
          Component1: 'Component 1',
          Component2: 'Component 2',
        },
      },
      mapping: {
        Component1: <Component1 />,
        Component2: <Component2 />,
      },
    },
    label: { control: 'text' },
    className: {
      control: 'text',
      description: 'This component needs a class for the bg and text color.',
    },
    icon: {
      options: ['None', 'Beer', 'Coffee'],
      description: 'Optional. Expecting a component.',
      mapping: {
        None: null,
        Beer: <FaBeer />,
        Coffee: <FaCoffee />,
      },
      control: {
        type: 'select',
        labels: {
          None: 'No Icon',
          Beer: 'Beer Icon',
          Coffee: 'Coffee Icon',
        },
      },
    },
  },
}

const Template = (args) => (
  <ChipComponent {...args}>{args.children}</ChipComponent>
)

export const Default = Template.bind({})
Default.args = {
  children: <Component1 />,
  className: 'bg-green-100 text-green-800',
}

export const WithIcon = Template.bind({})
WithIcon.args = {
  label: 'Cheers',
  icon: <FaBeer />,
  className: 'bg-blue-200 text-blue-800',
}
