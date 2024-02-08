import axios from "axios";
import {CHAPTER_API_V2, EXTRA_CHAPTER} from "@/app/auth/urls";

const getDataChapterId = async (id) => {
  const res = await axios.get(`${CHAPTER_API_V2}/` + id)
  return res.data.data;
}
const createDataChapter = async (data: any) => {
  return await axios.post(`${CHAPTER_API_V2}/create`, data)
}
const updateDataChapter = async (data: any) => {
  return await axios.post(`${CHAPTER_API_V2}/update`, data)
}
const deleteDataChapter = async (id) => {
  return await axios.post(`${CHAPTER_API_V2}/delete`, {id: id})
}
const copyDataChapter = async (contentId: string, chapterId: string) => {
  return await axios.post(`${CHAPTER_API_V2}/duplicate`, {contentId: contentId, chapterId: chapterId})
}

type MoveData = {
  chapterId: string,
  oldContentId: string,
  newContentId: string,
  chapterIndex: number
}
const moveChapter = async (data: MoveData) => {
  return await axios.post(`${CHAPTER_API_V2}/move`, data)
}
type IndexData = {
  chapterId: string,
  chapterIndex: number
}
export type Data = {
  indexData: IndexData[]
  contentId: string
}
const updateIndexChapter = async (data: Data) => {
  return await axios.post(`${CHAPTER_API_V2}/update-index`, data)
}

const createExtraChapter = async (data: any) => {
  return await axios.post(`${EXTRA_CHAPTER}/create`, data)
}

const updateExtraChapter = async (data: any) => {
  return await axios.post(`${EXTRA_CHAPTER}/update`, data)
}

export {
  getDataChapterId,
  createDataChapter,
  updateDataChapter,
  deleteDataChapter,
  updateIndexChapter,
  copyDataChapter,
  moveChapter,
  createExtraChapter,
  updateExtraChapter
}
