export const CHART_COLORS = [
  '#5975A6',
  '#63D1A0',
  '#CDA1FF',
  '#FFC523',
  '#FF9364',
  '#475569',
  '#818CF8',
] as const

export const formatChartNumber = (
  value: number | string | null | undefined,
  fixed: number = 0,
): string => {
  if (value === null || value === undefined) return '0'
  const num = typeof value === 'number' ? value : parseFloat(value)
  if (Number.isNaN(num)) return '0'
  return num.toLocaleString('en-US', {
    minimumFractionDigits: fixed,
    maximumFractionDigits: fixed,
  })
}

export const formatChartPercent = (
  value: number | string | null | undefined,
): string => {
  if (value === null || value === undefined) return '0'
  const num = typeof value === 'number' ? value : parseFloat(value)
  if (Number.isNaN(num) || num <= 0) return '0'
  if (num < 1) return '<1'
  return formatChartNumber(num)
}
