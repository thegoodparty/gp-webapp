'use client'
import { useContext } from 'react'
import { EcanvasserSurveyContext } from './EcanvasserSurveyProvider'

export const useEcanvasserSurvey = () => {
  const [survey, refreshSurvey] = useContext(EcanvasserSurveyContext)

  return [survey, refreshSurvey]
}
