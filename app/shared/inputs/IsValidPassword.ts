import { passwordRegex } from '../../../helpers/userHelper'

export const isValidPassword = (password: string): boolean =>
  password !== '' && passwordRegex.test(password)

