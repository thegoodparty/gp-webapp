import Body1 from '@shared/typography/Body1'
import H1 from '@shared/typography/H1'
import { FocusedExperienceWrapper } from 'app/(candidate)/dashboard/shared/FocusedExperienceWrapper'

export default {
  title: 'Unshared/FocusedExperienceWrapper',
  component: FocusedExperienceWrapper,
  tags: ['autodocs'],
  args: {
    message: 'Some helpful text here',
  },
  render: (args) => {
    return (
      <div className="flex flex-col gap-3 items-start">
        <strong>(Used in upgrade to pro flow)</strong>
        <FocusedExperienceWrapper {...args}>
          <H1 className="mb-4">Focused Experience Content</H1>
          <Body1>
            Magna esse commodo ea tempor velit aliqua est labore elit
            consectetur cupidatat adipisicing. Aute laborum commodo ex ad
            tempor. Elit pariatur enim tempor excepteur sint aute nisi. Et qui
            cupidatat eiusmod commodo eiusmod velit. Nulla nulla nulla aliqua
            cupidatat id proident non culpa cupidatat. Qui voluptate mollit
            cupidatat duis ea Lorem id elit velit aute proident est. Aute ut
            commodo elit magna.
          </Body1>
          <Body1>
            Magna esse commodo ea tempor velit aliqua est labore elit
            consectetur cupidatat adipisicing. Aute laborum commodo ex ad
            tempor. Elit pariatur enim tempor excepteur sint aute nisi. Et qui
            cupidatat eiusmod commodo eiusmod velit. Nulla nulla nulla aliqua
            cupidatat id proident non culpa cupidatat. Qui voluptate mollit
            cupidatat duis ea Lorem id elit velit aute proident est. Aute ut
            commodo elit magna.
          </Body1>
        </FocusedExperienceWrapper>
      </div>
    )
  },
}

export const Default = {}
