import Link from 'next/link'
import { FaArrowLeftLong } from 'react-icons/fa6'

export default function BackLink() {
  return (
    <Link
      href="/dashboard/text-messaging"
      className="flex items-center gap-2 mb-4"
    >
      <FaArrowLeftLong /> Text Messaging
    </Link>
  )
}
