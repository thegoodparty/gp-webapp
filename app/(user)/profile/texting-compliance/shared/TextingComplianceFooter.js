'use client'
import Button from '@shared/buttons/Button'
import { useFormData } from '@shared/hooks/useFormData'

export default function TextingComplianceFooter({ children }) {
  const { isValid } = useFormData()
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
        {/*md:relative*/}
        {/*md:mt-8*/}
        md:border-0
        md:p-8
        z-10
      "
    >
      <div className="flex gap-4 justify-end">
        {children || (
          <Button
            color="primary"
            size="large"
            className="flex-1 md:flex-initial"
            disabled={!isValid}
          >
            Submit
          </Button>
        )}
      </div>
    </div>
  )
}
