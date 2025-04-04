import ListItemComponent from './ListItem'

export default {
  title: 'Utils/ListItem',
  component: ListItemComponent,
  tags: ['autodocs'],
  args: {
    title: 'Title',
    number: 1,
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

export const ListItem = {}
