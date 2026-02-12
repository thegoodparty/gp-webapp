import Image from 'next/image'
import Body2 from '@shared/typography/Body2'
import H4 from '@shared/typography/H4'

interface BlogAuthorFooterProps {
  imageUrl?: string
  name: string
  summary: string
}

export default function BlogAuthorFooter({
  name,
  imageUrl,
  summary,
}: BlogAuthorFooterProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-x-3 py-8">
      <div>
        {imageUrl && (
          <div className="relative w-20 rounded">
            <Image
              style={{
                objectFit: 'cover',
                objectPosition: 'top center',
                borderRadius: '10px',
              }}
              src={`https:${imageUrl}`}
              alt={name}
              width={80}
              height={80}
            />
          </div>
        )}
      </div>
      <div>
        <H4 className="mb-2">{name}</H4>
        <Body2 className="text-gray-600">{summary}</Body2>
      </div>
    </div>
  )
}
