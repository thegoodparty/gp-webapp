'use client'
// <<<<<<< HEAD
import { useFormData } from '@shared/hooks/useFormData'

export default function TextingComplianceFooter({ children }) {
  const { isValid, formData } = useFormData()
  // =======
  // import Button from '@shared/buttons/Button'
  // import { useFormData } from '@shared/hooks/useFormData'
  //
  // export default function TextingComplianceFooter({ children }) {
  //   const { isValid } = useFormData()
  // >>>>>>> origin/develop
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
      {/*<<<<<<< HEAD*/}
      <div className="flex gap-4 justify-end">{children}</div>
      {/*=======*/}
      {/*      <div className="flex gap-4 justify-end">*/}
      {/*        {children || (*/}
      {/*          <Button*/}
      {/*            color="primary"*/}
      {/*            size="large"*/}
      {/*            className="flex-1 md:flex-initial"*/}
      {/*            disabled={!isValid}*/}
      {/*          >*/}
      {/*            Submit*/}
      {/*          </Button>*/}
      {/*        )}*/}
      {/*      </div>*/}
      {/*>>>>>>> origin/develop*/}
    </div>
  )
}
