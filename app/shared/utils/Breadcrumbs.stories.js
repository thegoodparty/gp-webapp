import Breadcrumbs from './Breadcrumbs'

export default {
  title: 'Utils/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  args: {
    links: [
      { label: 'Blog', href: 'https://goodparty.org' },
      { label: 'Politics', href: 'https://goodparty.org' },
      { label: 'Activism', href: 'https://goodparty.org' },
      { label: 'How to Get Involved With Political Activism.' },
    ],
  },
}

export const Default = {}
export const ChevronDelimiter = { args: { delimiter: 'chevron' } }
