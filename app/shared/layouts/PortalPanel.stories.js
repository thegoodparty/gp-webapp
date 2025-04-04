import H1 from '@shared/typography/H1'
import PortalPanel from './PortalPanel'
import Body1 from '@shared/typography/Body1'

export default {
  title: 'Layouts/PortalPanel',
  component: PortalPanel,
  tags: ['autodocs'],
  args: {
    color: '#2CCDB0',
  },
  parameters: {
    backgrounds: {
      default: 'Medium',
    },
  },
  render: (args) => (
    <PortalPanel {...args}>
      <H1>Content Header</H1>
      <Body1>
        Ut elit laboris anim occaecat esse exercitation ea magna enim
        consectetur excepteur enim proident Lorem. Aliqua minim sunt id
        reprehenderit dolor. Exercitation veniam do laboris labore anim dolor
        Lorem quis irure. Officia nisi eiusmod ad aute Lorem do adipisicing
        aliquip qui. Veniam Lorem enim aliquip dolore ut nulla. Magna aliqua qui
        nostrud officia qui culpa aliqua do est.
      </Body1>
    </PortalPanel>
  ),
}

export const Default = {}
