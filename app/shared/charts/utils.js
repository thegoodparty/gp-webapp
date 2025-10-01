import { numberFormatter } from 'helpers/numberHelper'

export const formatPercentLabel = (value) => {
  if (value === null || value === undefined) return '0'
  let num = value
  if (typeof num !== 'number') {
    num = parseFloat(num)
  }
  if (Number.isNaN(num) || num <= 0) return '0'
  if (num < 1) return '<1'
  return numberFormatter(num)
}


