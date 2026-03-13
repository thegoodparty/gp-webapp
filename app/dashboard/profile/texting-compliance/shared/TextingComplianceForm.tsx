'use client'

import React from 'react'

interface TextingComplianceFormProps {
  children: React.ReactNode
}

export default function TextingComplianceForm({
  children,
}: TextingComplianceFormProps): React.JSX.Element {
  return <form className="pb-16 md:p-0 flex flex-col gap-4">{children}</form>
}
