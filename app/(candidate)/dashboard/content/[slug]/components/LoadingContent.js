import Image from 'next/image'

export default function LoadingContent({
  title = 'Your content is generating...',
  subtitle = 'This may take 1-2 minutes.',
}) {
  return (
    <div className="bg-white p-6 my-10 rounded-xl text-center text-xl">
      <div className="mb-3 text-4xl">{title}</div>
      <div className="flex items-center justify-center">
        <Image
          src="/images/campaign/spinner.gif"
          alt="Loading"
          width={48}
          height={48}
        />
        <div className="mr-3 text-xl font-sfpro text-purple-500">
          {subtitle}
        </div>
      </div>
    </div>
  )
}
