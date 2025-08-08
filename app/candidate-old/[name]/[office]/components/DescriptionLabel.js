import Body1 from '@shared/typography/Body1'
import Overline from '@shared/typography/Overline'

export default function DescriptionLabel({ title, description, className }) {
  if (!description) return null
  return (
    <div className={`mb-8 ${className}`}>
      <Overline className="text-gray-400">{title}</Overline>
      <Body1 className="mt-2">{description}</Body1>
    </div>
  )
}
