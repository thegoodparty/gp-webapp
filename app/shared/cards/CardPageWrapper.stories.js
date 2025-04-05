import H3 from '@shared/typography/H3'
import CardPageWrapper from './CardPageWrapper'
import Body1 from '@shared/typography/Body1'

export default {
  title: 'Cards/CardPageWrapper',
  component: CardPageWrapper,
  tags: ['autodocs'],
  args: {
    children: (
      <>
        <H3>Here is your content</H3>
        <Body1>
          Minim eu culpa Lorem fugiat. Incididunt consequat aliquip et non
          veniam sint et eiusmod cupidatat magna magna non ipsum dolor. Anim
          aliqua non enim aliquip eu veniam fugiat reprehenderit. Commodo culpa
          qui adipisicing ullamco tempor laboris tempor cillum. Officia
          cupidatat veniam proident sunt occaecat non nisi nisi officia dolor
          Lorem ipsum est.
        </Body1>
      </>
    ),
  },
}

export const Default = {}
