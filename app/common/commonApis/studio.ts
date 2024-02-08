import axios from "axios";
import {STUDIO_URL} from "@/app/auth/urls";

export const updateStudio = async (data: any) => {
  return await axios.post(`${STUDIO_URL}`, data)
}
export const getStudiosByIds = async (id: string | string[]) => {
  return await axios.get(`${STUDIO_URL}/` + id)
}
