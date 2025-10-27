export const getCookie = (name) => {
  if (typeof window === 'undefined') {
    return false
  }
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return decodeURI(parts.pop().split(';').shift())
  return false
}

export const setCookie = (name, value, days = 120) => {
  if (typeof window === 'undefined') {
    return
  }
  let expires = ''
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = `; expires=${date.toUTCString()}; SameSite=Strict`
  }
  document.cookie = `${name}=${
    encodeURI(value) || ''
  }${expires}; path=/; SameSite=Lax`
}

export const deleteCookies = () => {
  if (typeof window === 'undefined') {
    return
  }
  document.cookie.split(';').forEach((c) => {
    document.cookie = c
      .replace(/^ +/, '')
      .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`)
  })
}

export const deleteUserCookies = () => {
  deleteCookie('user')
  deleteCookie('impersonateUser')
  deleteCookie('signupRedirect')
}

export const deleteCookie = (name) => {
  if (typeof window === 'undefined') {
    return
  }
  setCookie(name, '', 0)
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}

export const setUserCookie = (value) => {
  if (typeof window === 'undefined') {
    return
  }
  const val = typeof value === 'string' ? value : JSON.stringify(value)
  setCookie(getCookie('impersonateUser') ? 'impersonateUser' : 'user', val)
}

export const getUserCookie = (withParse = false) => {
  if (typeof window === 'undefined') {
    return false
  }

  const impersonateUser = getCookie('impersonateUser')
  if (impersonateUser) {
    if (withParse) {
      return JSON.parse(impersonateUser)
    } else {
      return impersonateUser
    }
  }

  let userCookieName = 'user'

  const user = getCookie(userCookieName)
  if (user && withParse) {
    try {
      return JSON.parse(decodeURIComponent(user))
    } catch (e) {
      console.error('User cookie parse failed')
      deleteCookie(userCookieName)
      return false
    }
  }
  if (user) {
    return decodeURIComponent(user)
  } else {
    return false
  }
}
