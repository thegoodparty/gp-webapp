import ResponsiveModal from '@shared/utils/ResponsiveModal'
import H1 from '@shared/typography/H1'
import Link from 'next/link'
import ShareButtons from './ShareButtons'

interface ShareModalProps {
  open: boolean
  onClose: () => void
  url: string
}

export default function ShareModal({
  open,
  onClose,
  url,
}: ShareModalProps): React.JSX.Element {
  return (
    <ResponsiveModal open={open} onClose={onClose}>
      <div className="text-center w-auto md:w-[600px]">
        <H1 className="mb-4">Share your campaign website</H1>
        <Link href={url} className="text-gray-500 text-sm" target="_blank">
          {url}
        </Link>
      </div>
      <ShareButtons url={url} className="mt-8" />
    </ResponsiveModal>
  )
}
