'use client'
import { useAcademySignUpModalState } from './useAcademySignUpModalState'
import { Children, cloneElement, ReactNode, ReactElement } from 'react'

interface AcademyModalSignUpButtonProps {
  children: ReactNode
}

export const AcademyModalSignUpButton = ({
  children,
  ...restProps
}: AcademyModalSignUpButtonProps &
  Record<string, string | number | boolean | object | null>):
  | (ReactElement | null)[]
  | null
  | undefined => {
  const { openModal } = useAcademySignUpModalState()
  const renderChildren = () => {
    return Children.map(children, (child) => {
      return cloneElement(
        child as ReactElement,
        {
          onClick: openModal,
          ...restProps,
        } as Record<string, string | number | boolean | object | null>,
      )
    })
  }
  return renderChildren()
}
