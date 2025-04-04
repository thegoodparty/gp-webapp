'use client'
import { useAcademySignUpModalState } from './useAcademySignUpModalState'
import { Children, cloneElement } from 'react'

export const AcademyModalSignUpButton = ({ children, ...restProps }) => {
  const { openModal } = useAcademySignUpModalState()
  const renderChildren = () => {
    return Children.map(children, (child) => {
      return cloneElement(child, {
        onClick: openModal,
        ...restProps,
      })
    })
  }
  return renderChildren()
}
