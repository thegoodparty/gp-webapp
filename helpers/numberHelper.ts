export const percHelper = (num: number | string | null | undefined, significant: boolean = false): number | string | null | undefined => {
  if (!num) return num
  let numValue = num
  if (typeof num !== 'number') {
    numValue = parseFloat(num)
  }
  if (significant) {
    return toPrecision((numValue as number) * 100)
  }
  return ((numValue as number) * 100).toFixed(2)
}

export const numberNth = (number: number | string | null | undefined): string => {
  if (!number) {
    return ''
  }
  let num = number
  if (typeof number === 'string') {
    num = parseInt(number, 10)
  }
  const j = (num as number) % 10
  const k = (num as number) % 100
  if (j === 1 && k !== 11) {
    return `${num}st`
  }
  if (j === 2 && k !== 12) {
    return `${num}nd`
  }
  if (j === 3 && k !== 13) {
    return `${num}rd`
  }
  return `${num}th`
}

export const numberFormatter = (num: number | string, fixed: number = 0): string => {
  if (isNaN(Number(num))) {
    return '0'
  }
  if (!num) return '0'
  let numValue = num
  if (typeof num !== 'number') {
    numValue = parseFloat(num)
  }
  return `${(numValue as number)
    .toFixed(fixed)
    .replace(/./g, (c: string, i: number, a: string) =>
      i && c !== '.' && (a.length - i) % 3 === 0 ? `,${c}` : c,
    )}`
}

export const formatCurrency = (dollars: number) => `${numberFormatter(dollars, 2)}`

export const toPrecision = (num: number | null | undefined): number | null | undefined => {
  if (!num) {
    return num
  }
  return parseFloat(num.toPrecision(2))
}

export const kFormatter = (num: number | null | undefined): string | number => {
  if (!num) {
    return 0
  }
  if (Math.abs(num) > 999999) {
    return Math.sign(num) * parseFloat((Math.abs(num) / 1000000).toFixed(1)) + 'M'
  }
  return Math.abs(num) > 999
    ? Math.sign(num) * parseFloat((Math.abs(num) / 1000).toFixed(1)) + 'K'
    : Math.sign(num) * Math.abs(num)
}

export const formatPhoneNumber = (value: string | null | undefined): string => {
  if (!value) {
    return ''
  }
  let noCountryCode = value
  if (value.charAt(0) === '1') {
    noCountryCode = value.substring(1)
  }
  const input = noCountryCode.replace(/\D/g, '').substring(0, 10)
  const areaCode = input.substring(0, 3)
  const middle = input.substring(3, 6)
  const last = input.substring(6, 10)

  if (input.length > 6) {
    return `(${areaCode}) ${middle}-${last}`
  }
  if (input.length > 3) {
    return `(${areaCode}) ${middle}`
  }
  if (input.length > 0) {
    return `(${areaCode}`
  }
  return ''
}

export const dollarsToCents = (dollarsDecimal: number = 0): number => dollarsDecimal * 100
export const centsToDollars = (cents: number = 0): number => cents / 100

export const formatDisplayPhoneNumber = (value: string | null | undefined): string => {
  if (!value) return ''

  const digits = value.replace(/\D/g, '').slice(-10)

  if (digits.length !== 10) return ''

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

