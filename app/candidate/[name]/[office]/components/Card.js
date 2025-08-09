import Body1 from '@shared/typography/Body1'
import H3 from '@shared/typography/H3'
import H4 from '@shared/typography/H4'
import Paper from '@shared/utils/Paper'

export default function Card({ title, items }) {
  return (
    <Paper>
      <H3 className="mb-4 border-b border-gray-200 pb-4">{title}</H3>
      {items.map((item, index) => (
        <div
          key={index}
          className={`${
            index === items.length - 1
              ? 'mb-0 border-b-0'
              : 'pb-4 mb-4 border-b border-gray-200'
          }`}
        >
          <H4 className="">{item.title}</H4>
          <Body1 className="mt-2 pb-2">
            {item.description ||
              'This candidate has not filled out this section yet.'}
          </Body1>
        </div>
      ))}
    </Paper>
  )
}
