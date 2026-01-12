'use client'
import { useContext } from 'react'
import { EcanvasserSurveyContext, EcanvasserSurveyContextValue } from './EcanvasserSurveyProvider'

export const useEcanvasserSurvey = (): EcanvasserSurveyContextValue => {
  return useContext(EcanvasserSurveyContext)
}

