import AccordionComponent from './Accordion';

export default {
  title: 'Utils/Accordion',
  component: AccordionComponent,
  tags: ['autodocs'],
  args: {
    summaries: [
      {
        label: 'Summary label',
        icon: 'https://cdn-icons-png.flaticon.com/512/4436/4436481.png',
      },
      {
        label: 'Summary label2',
        icon: 'https://cdn-icons-png.flaticon.com/512/3675/3675672.png',
      },
    ],
    panels: [
      <div key="a">Panel content1</div>,
      <div key="b">Panel content2</div>,
    ],
  },
};

export const Accordion = {};
