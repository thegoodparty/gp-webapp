import TabsComponent from './Tabs'

export default {
  title: 'Utils/Tabs',
  component: TabsComponent,
  tags: ['autodocs'],
  args: {
    tabLabels: ['tab a', 'tab b'],
    tabPanels: [<div key="a">I am tab A</div>, <div key="b">I am tab B</div>],
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'The component orientation (layout flow direction).',
      table: {
        type: {
          summary: 'string',
        },
      },
    },
    variant: {
      control: 'select',
      options: ['fullWidth', 'scrollable', 'standard'],
      description:
        'Determines additional display behavior of the tabs: - scrollable will invoke scrolling properties and allow for horizontally scrolling (or swiping) of the tab bar. -fullWidth will make the tabs grow to use all the available space, which should be used for small views, like on mobile. - standard will render the default state.',
      table: {
        type: {
          summary: 'string',
        },
      },
    },
    centered: {
      options: [true, false],
      control: { type: 'select' },
      description:
        'If true, the tabs are centered. This prop is intended for large views.',
      table: {
        type: {
          summary: 'select',
        },
        defaultValue: { summary: false },
      },
    },
  },
}

export const Tabs = {}
