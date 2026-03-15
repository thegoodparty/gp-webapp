import type { Preview } from '@storybook/nextjs-vite'
import React from 'react'
import '../app/globals.css'

const preview: Preview = {
  decorators: [
    // Wrap all stories in a data-slot container so styleguide-scope.css
    // overrides apply (including --color-* Tailwind tokens)
    (Story) => React.createElement('div', { 'data-slot': 'storybook' }, React.createElement(Story)),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
}

export default preview
