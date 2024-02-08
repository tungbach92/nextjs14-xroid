import axios from "axios";
import {ENECOLOR_RANK_SETTING} from "@/app/auth/urls";

export const createEneColorSetting = async (data: any) => {
  return await axios.post(`${ENECOLOR_RANK_SETTING}/create`, data)
}
export const deleteEneColorSetting = async (id: string) => {
  return await axios.post(`${ENECOLOR_RANK_SETTING}/delete/${id}`)
}
