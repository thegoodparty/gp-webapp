import AccordionSummaryComponent from './AccordionSummary';

export default {
  title: 'Utils/AccordionSummary',
  component: AccordionSummaryComponent,
  tags: ['autodocs'],
  args: {
    label: 'Summary label',
    icon: 'https://cdn-icons-png.flaticon.com/512/4436/4436481.png',
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
    open: {
      options: [true, false],
      control: { type: 'select' },
      description: 'Open and closed state',
      table: {
        type: {
          summary: 'select',
        },
        defaultValue: { summary: false },
      },
    },
  },
};

export const Open = {
  args: {
    open: true,
  },
};

export const Closed = {
  args: {
    open: false,
  },
};
