import '../app/globals.css';

const preview = {
  parameters: {
    backgrounds: {
      values: [
        { name: 'Dark', value: '#0D1528' }, // indigo-900
        { name: 'Medium', value: '#EEF3F6' }, // indigo-100
        { name: 'Light', value: '#F7FAFB'} // indigo-50
      ],
      default: 'Light',
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
