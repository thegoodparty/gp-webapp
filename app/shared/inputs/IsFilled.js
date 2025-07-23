import isEmpty from 'validator/es/lib/isEmpty'

export const isFilled = (v) => !isEmpty(v) && v.length >= 2

export default isFilled 