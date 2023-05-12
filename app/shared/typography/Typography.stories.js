import { H1 } from './H1';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
  title: 'Typography',
  component: H1,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'Click me',
    },
  },
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary = {
  args: {
    children: 'Click me2',
  },
};

// export const Secondary = {
//   args: {
//     label: 'Typography',
//   },
// };

// export const Large = {
//   args: {
//     size: 'large',
//     label: 'Typography',
//   },
// };

// export const Small = {
//   args: {
//     size: 'small',
//     label: 'Typography',
//   },
// };
