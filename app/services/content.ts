import {toast} from "react-toastify";

export const saveSuccess = () => {
  toast.success("保存しました", {autoClose: 3000});
}
export const saveError = (msg = '') => {
  toast.error(`保存に失敗しました ${msg}`, {autoClose: 3000});
}
