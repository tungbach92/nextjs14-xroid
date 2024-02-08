import {IS_SOCIAL_SIGN_IN, LOGIN_KEY, REDIRECT_URL_KEY, REGISTER_KEY, USER_INFO_KEY} from "@/app/configs/constants";
import store from 'store';

export const removeLoginOrRegisterKeys = () => {
  store.remove(REGISTER_KEY);
  store.remove(LOGIN_KEY);
  store.remove(USER_INFO_KEY);
  store.remove(REDIRECT_URL_KEY);
  store.remove('course_id');
  store.remove('service_id');
  store.remove('language');
  store.remove(IS_SOCIAL_SIGN_IN)
}
