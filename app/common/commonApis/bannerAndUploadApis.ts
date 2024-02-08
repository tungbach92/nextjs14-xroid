import axios from "axios";
import {BANNER_URL, POPUP_URL} from "@/app/auth/urls";

const createBanner = (data: any) => {
  return axios.post(`${BANNER_URL}/create`, data)
}
const deleteBanner = (id) => {
  return axios.post(`${BANNER_URL}/delete/${id}`)
}
const updateBanner = (data: any) => {
  return axios.post(`${BANNER_URL}/update`, data)
}

const updateBannerIndex = (data: { index: number, id: string }) => {
  return axios.post(`${BANNER_URL}/update-index`, data)
}

const updatePopupIndex = (data: { index: number, id: string }) => {
  return axios.post(`${POPUP_URL}/update-index`, data)
}

const createPopup = (data: any) => {
  return axios.post(`${POPUP_URL}/create`, data)
}
const deletePopup = (id) => {
  return axios.post(`${POPUP_URL}/delete/${id}`)
}

const updatePopup = (data: any) => {
  return axios.post(`${POPUP_URL}/update`, data)
}
export {
  createPopup,
  deletePopup,
  updatePopup,
  createBanner,
  deleteBanner,
  updateBanner,
  updateBannerIndex,
  updatePopupIndex
}

