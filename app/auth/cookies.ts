import Cookies from 'js-cookie'

const isProd = process.env.NEXT_PUBLIC_APP_ENV === 'production'
const domain = isProd ? '.geniam.com' : null

export function removeCookie(name, options = {}) {
  return Cookies.remove(name, {domain, ...options})
}
