import axios from "axios";
import {auth} from "@/app/configs/firebase";
import {makeUseAxios} from 'axios-hooks'
import {BASE_API_URL} from "@/app/auth/urls";

axios.defaults.baseURL = BASE_API_URL

export const axiosConfigs = () => {
  //REQUEST
  axios.interceptors.request.use(
    async (config: any) => {
      const token = await auth.currentUser?.getIdToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
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
