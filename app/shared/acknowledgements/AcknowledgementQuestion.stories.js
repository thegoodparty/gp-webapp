import { PersonRounded } from '@mui/icons-material'
import { AcknowledgementQuestion } from './AcknowledgementQuestion'

export default {
  title: 'Acknowledgements/AcknowledgementQuestion',
  component: AcknowledgementQuestion,
  tags: ['autodocs'],
  args: {
    emoticon: <PersonRounded />,
    title: 'Independent',
    body: `I am an independent, non-partisan, or third-party candidate. I am committed to the interests of the people above myself and partisan politics.

I am NOT running as a Republican or Democrat in a partisan election. I am committed to running and serving independent of the two-major parties. I will represent people from across the political spectrum and be dedicated to advancing the priorities of my constituents.

I pledge I will NOT pay membership dues to or otherwise engage in fundraising for either of the two major political party committees while in office, and will remain open to working with all sides to the benefit of my constituents.
    `,
    show: true,
  },

  argTypes: {
    title: {
      type: 'string',
    },
    body: {
      type: 'string',
    },
    show: {
      type: 'boolean',
    },
    acknowledged: {
      type: 'boolean',
    },
    buttonTexts: {
      type: {
        name: 'array',
        value: 'string',
      },
    },
  },
}

export const Default = {}

// export const Primary = {
//   args: {
//     variant: 'contained',
//   },
// };

// export const Outlined = {
//   args: {
//     variant: 'outlined',
//   },
// };

// export const Text = {
//   args: {
//     variant: 'text',
//   },
// };
