export const percHelper = (num, significant = false) => {
  if (!num) return num
  if (typeof num !== 'number') {
    num = parseFloat(num)
  }
  if (significant) {
    return toPrecision(num * 100)
  }
  return (num * 100).toFixed(2)
}

export const numberNth = (number) => {
  if (!number) {
    return ''
  }
  let num = number
  if (typeof number === 'string') {
    num = parseInt(number, 10)
  }
  const j = num % 10
  const k = num % 100
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

export const numberFormatter = (num, fixed = 0) => {
  if (isNaN(num)) {
    return 0
  }
  if (!num) return 0
  if (typeof num !== 'number') {
    num = parseFloat(num)
  }
  return `${num
    .toFixed(fixed)
    .replace(/./g, (c, i, a) =>
      i && c !== '.' && (a.length - i) % 3 === 0 ? `,${c}` : c,
    )}`
}

export const toPrecision = (num) => {
  if (!num) {
    return num
  }
  return parseFloat(num.toPrecision(2))
}

export const kFormatter = (num) => {
  if (!num) {
    return 0
  }
  if (Math.abs(num) > 999999) {
    return Math.sign(num) * (Math.abs(num) / 1000000).toFixed(1) + 'M'
  }
  return Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + 'K'
    : Math.sign(num) * Math.abs(num)
}

export const formatPhoneNumber = (value) => {
  if (!value) {
    return ''
  }
  let noCountryCode = value
  if (value.charAt(0) === '1') {
    noCountryCode = value.substring(1)
  }
  const input = noCountryCode.replace(/\D/g, '').substring(0, 10) // First ten digits of input only
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
}
