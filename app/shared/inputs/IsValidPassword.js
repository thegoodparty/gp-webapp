import { passwordRegex } from '../../../helpers/userHelper'

export const isValidPassword = (password) =>
  password !== '' && password.match(passwordRegex)
