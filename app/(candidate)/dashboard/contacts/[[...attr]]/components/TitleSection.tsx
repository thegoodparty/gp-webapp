import Body1 from '@shared/typography/Body1'

export default function TitleSection(): React.JSX.Element {
  return (
    <section>
      <h1 className="text-2xl font-semibold">Contacts</h1>
      <Body1 className="mt-2 text-gray-500">
        Manage your constituency data
      </Body1>
    </section>
  )
}
