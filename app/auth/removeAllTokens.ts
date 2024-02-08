import {removeCookie} from "@/app/auth/cookies";
import {
  ACCESS_TOKEN_KEY, COOKIE_GENIAM_ACCESS_TOKEN_KEY,
  COOKIE_GENIAM_REFRESH_TOKEN_KEY, COOKIE_GENIAM_USER_INFO_KEY,
  ID_TOKEN_KEY,
  IS_SOCIAL_SIGN_IN,
  REFRESH_TOKEN_KEY
} from "@/app/configs/constants";
import store from 'store';
export const removeAllTokens = () => {
  store.remove(ACCESS_TOKEN_KEY);
  store.remove(ID_TOKEN_KEY);
  store.remove(REFRESH_TOKEN_KEY);
  store.remove(IS_SOCIAL_SIGN_IN);
  removeCookie(COOKIE_GENIAM_REFRESH_TOKEN_KEY)
  removeCookie(COOKIE_GENIAM_ACCESS_TOKEN_KEY)
  removeCookie(COOKIE_GENIAM_USER_INFO_KEY)

}

