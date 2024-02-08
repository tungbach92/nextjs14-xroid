import axios from "axios";
import {ENECOLORS} from "@/app/auth/urls";
import {Enecolor} from "@/app/types/block";
import {DataCheck} from "@/app/types/types";

export const createEneColor = async (data: Enecolor) => {
  return await axios.post(`${ENECOLORS}/create`, data)
}
export const updateEneColor = async (data: Enecolor) => {
  return await axios.post(`${ENECOLORS}/update/${data.id}`, data)
}
export const deleteEneColor = async (id: string) => {
  return await axios.post(`${ENECOLORS}/delete/${id}`)
}
export const copyEneColor = async (id: string) => {
  return await axios.post(`${ENECOLORS}/copy`, {id: id})
}
export const checkEnecolorDelete = async (id: string): Promise<DataCheck> => {
  const res = await axios.get(`${ENECOLORS}/check/${id}`)
  return res.data.data
}
