import TogglePanelComponent from './TogglePanel'

export default {
  title: 'Utils/TogglePanel',
  component: TogglePanelComponent,
  tags: ['autodocs'],
  args: {
    label: 'Summary label',
    icon: 'https://cdn-icons-png.flaticon.com/512/4436/4436481.png',
    children: 'Panel content',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Label',
      table: {
        type: {
          summary: 'string',
        },
      },
    },
    children: {
      control: 'text',
      description: 'Node or text for the panel',
      table: {
        type: {
          summary: 'string',
        },
      },
    },
  },
}

export const TogglePanel = {}
