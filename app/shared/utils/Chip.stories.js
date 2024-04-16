import ChipComponent from './Chip';
import { FaBeer, FaCoffee } from 'react-icons/fa';

export default {
  title: 'Utils/Chip',
  component: ChipComponent,
  tags: ['autodocs'],
  argTypes: {
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
};

const Template = (args) => <ChipComponent {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'Default Chip',
  className: 'bg-green-100 text-green-800',
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  label: 'Cheers',
  icon: <FaBeer />,
  className: 'bg-blue-200 text-blue-800',
};
