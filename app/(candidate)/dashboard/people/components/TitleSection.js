import Body1 from '@shared/typography/Body1'
import H1 from '@shared/typography/H1'
import Paper from '@shared/utils/Paper'

export default function TitleSection() {
  return (
    <Paper>
      <section className="text-center">
        <H1>People</H1>
        <Body1 className="mt-2">Manage your constituency data</Body1>
      </section>
    </Paper>
  )
}
