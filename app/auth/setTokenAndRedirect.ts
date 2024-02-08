import {ACCESS_TOKEN_KEY, COOKIE_GENIAM_REFRESH_TOKEN_KEY, USER_INFO_KEY} from "@/app/configs/constants";
import Cookies from 'js-cookie'
import axios from "axios";
import {USER_INFO} from "@/app/auth/urls";
import {removeLoginOrRegisterKeys} from "@/app/auth/removeLoginOrRegisterKeys";
import store from 'store';


const isProd = process.env.NEXT_PUBLIC_APP_ENV === 'production'
const domain = isProd ? '.geniam.com' : null
const expires = 365 //days

function setCookie(name, value, options = {}) {
  if (!value) return
  return Cookies.set(name, value, {domain, expires, ...options})
}

const setTokenAndRedirect = async ({
                                     setUserInfo,
                                     access_token,
                                     refresh_token,
                                   }, router) => {
  try {
    removeLoginOrRegisterKeys()
    const res = await axios.get(USER_INFO)
    store.set(ACCESS_TOKEN_KEY, access_token)
    store.set(USER_INFO_KEY, res.data)
    setCookie(COOKIE_GENIAM_REFRESH_TOKEN_KEY, refresh_token)
    setUserInfo(res.data)
    router.push('/contents')
  } catch (e) {
    console.log(e);
  }
}
export {
  setTokenAndRedirect
}
