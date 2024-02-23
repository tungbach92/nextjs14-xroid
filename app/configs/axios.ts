import axios from "axios";
import {auth} from "@/app/configs/firebase";
import {makeUseAxios} from 'axios-hooks'
import {BASE_API_URL} from "@/app/auth/urls";
import store from "store";
import {ACCESS_TOKEN_KEY} from "@/app/lib/constants";
import {onAuthStateChanged} from "@firebase/auth";

axios.defaults.baseURL = BASE_API_URL

export const axiosConfigs = () => {
  //REQUEST
  axios.interceptors.request.use(
    async (config: any) => {
      let token;
      onAuthStateChanged(auth, async user => {
        token = await user?.getIdToken();
        token && store.set(ACCESS_TOKEN_KEY, token)
      })
      if (!token) {
        token = store.get(ACCESS_TOKEN_KEY)
      }
      config.headers['Authorization'] = `Bearer ${token}`;
      return config;
    },
    error => {
      // if (error && error.request) {}
      return Promise.reject(error);
    });

  //RESPONSE
  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    async function (error) {
      return Promise.reject(error);
    }
  );
}


export const useAxios = makeUseAxios();
