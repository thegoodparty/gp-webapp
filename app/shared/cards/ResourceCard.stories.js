import ResourceCardComponent from './ResourceCard'

export default {
  title: 'Cards/ResourceCard',
  component: ResourceCardComponent,
  tags: ['autodocs'],
  args: {
    title: 'Squarespace Beginner Tutorial for Absolute wow wow',
    description: "Description here that's interesting and wow things here",
    link: 'https://goodparty.org',
  },
  argTypes: {
    description: {
      control: 'text',
      description: 'Card Description',
      table: {
        type: {
          summary: 'string',
        },
      },
    },
    icon: {
      control: 'text',
      description: 'Optional Icon',
      table: {
        type: {
          summary: 'string',
        },
      },
    },
  },
}

export const ResourceCard = {
  args: {
    icon: false,
  },
}
