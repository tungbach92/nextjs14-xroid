import axios from "axios";
import {SLIDE_URL} from "@/app/auth/urls";

const getSlides = async () => {
    const res = await axios.get(`${SLIDE_URL}`)
    return res.data.data;
}

const createSlide = async (data: any) => {
    return await axios.post(`${SLIDE_URL}/create`, data)
}

const deleteSlide = async (id) => {
    return await axios.post(`${SLIDE_URL}/delete`, {id: id})
}

const getThumbByPresentationId = async (presentationId, thumbSize = 'm') => {
  const res = await axios.get(`${SLIDE_URL}/load-google-first-thumbnail?presentationId=` + presentationId + '&thumbSize=' + thumbSize)
  return res.data.data;
}

const getThumbById = async (presentationId, pageObjectId, thumbSize = 'm', thumbOnly = "yes") => {
  const res = await axios.get(`${SLIDE_URL}/load-google-thumbnail?presentationId=` + presentationId + '&pageObjectId=' + pageObjectId + '&thumbSize=' + thumbSize + '&thumbOnly=' + thumbOnly)
  return res.data.data;
}

const getUrlsThumbnail = async (presentationId, thumbSize = 'm') => {
  const res = await axios.get(`${SLIDE_URL}/load-google-all-thumbnail?presentationId=` + presentationId + '&thumbSize=' + thumbSize)
  return res.data.data;
}

export {getSlides, createSlide, deleteSlide, getThumbByPresentationId, getThumbById, getUrlsThumbnail}
