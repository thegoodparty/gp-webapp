'use client'
import { useFormData } from '@shared/hooks/useFormData'

interface TextingComplianceFooterProps {
  children: React.ReactNode
}

export default function TextingComplianceFooter({ children }: TextingComplianceFooterProps): React.JSX.Element {
  useFormData()
  return (
    <div
      className="
        fixed
        bottom-0
        left-0
        right-0
        border-t
        border-gray-200
        bg-white
        p-4
        md:mx-auto
        md:max-w-2xl
        md:border-0
        md:p-8
        z-10
      "
    >
      <div className="flex gap-4 justify-end">{children}</div>
    </div>
  )
}
