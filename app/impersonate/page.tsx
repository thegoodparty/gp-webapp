import { Suspense } from 'react'
import ImpersonatePageContent from './ImpersonatePageContent'

export default function ImpersonatePage() {
  return (
    <Suspense fallback={<div>Setting up session…</div>}>
      <ImpersonatePageContent />
    </Suspense>
  )
}
