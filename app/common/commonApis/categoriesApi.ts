import axios from "axios";
import {CATEGORIES_URL} from "@/app/auth/urls";

export const createCategories = async (data: any) => {
  return await axios.post(`${CATEGORIES_URL}/child/create`, data)
}

export const createParentCategories = async (data: { name: string }) => {
  return await axios.post(`${CATEGORIES_URL}/parent/create`, data)
}

export const deleteCategories = async (id: string) => {
  return await axios.post(`${CATEGORIES_URL}/delete/${id}`)
}

export const updateIndexCategories = async (data: any) => {
  return await axios.post(`${CATEGORIES_URL}/update/index`, data)
}

