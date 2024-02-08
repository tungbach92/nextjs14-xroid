import {toast} from "react-toastify";

export default function showAxiosError(e) {
  if (e && e.response && e.response.data) {
    const {error_code, error_message, err, message, error} = e.response.data;
    if (error_code && error_message) {
      console.log({error_code, error_message})
    }
    if (err || message) {
      console.log({err, message});
    }
    toast.error(error_message || message || err || error)
    return error;//return from last catch error object
  }
}
