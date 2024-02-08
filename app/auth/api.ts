import Cookies from "js-cookie";
import axios from "axios";
import {signInWithEmailAndPassword} from "firebase/auth"
import {auth} from "@/app/configs/firebase";
import {LOGIN, LOGIN_EMAIL, LOGIN_EMAIL_V2, MYACCOUNT_PREFIX, REGISTER, REGISTER_EMAIL} from "@/app/auth/urls";
import {COOKIE_GENIAM_USER_INFO_KEY, USER_INFO_KEY} from "@/app/configs/constants";
import store from 'store';


export async function registerEmailAsync(email, data = {}) {
  let postData: any = {
    email,
    ...data,
    redirect_url: `${MYACCOUNT_PREFIX}/register/name-password-input?email=${email}`
  };
  if (!postData.service_id) {
    postData.service_id = 0;
  }
  if (!postData.course_id) {
    postData.course_id = 0;
  }

  return await axios.post(REGISTER_EMAIL, postData)
}

export function register(data, then) {
  axios.post(REGISTER, data)
    .then((response) => {
      // handle success
      if (then) then(null, response);
    })
    .catch((error) => {
      // handle error
      if (then) then(error, null);
    });
}



export async function loginEmailAsync(email) {
  return await axios.post(LOGIN_EMAIL, {email});
}
export async function loginEmailV2Async(email) {
  return await axios.post(LOGIN_EMAIL_V2, {email});
}

export function login(email, password, then) {
  store.remove(USER_INFO_KEY);
  Cookies.remove(COOKIE_GENIAM_USER_INFO_KEY)
  const postData = {
    email,
    password,
    redirect_url: window.location.origin + '/login'
  };
  axios.post(LOGIN, postData)
    .then((res) => {
      if (then) then(null, res)
    })
    .catch(e => {
      if (then) then(e, null)
    })
}

export async function loginAsync(email, password, params = {}) {
  store.remove(USER_INFO_KEY)
  Cookies.remove(COOKIE_GENIAM_USER_INFO_KEY)
  const {user} = await signInWithEmailAndPassword(auth, email, password)
  return user
}
