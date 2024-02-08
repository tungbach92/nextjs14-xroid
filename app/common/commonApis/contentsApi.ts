import axios from "axios";
import {Content} from "@/app/types/content";
import {CONTENTS} from "@/app/auth/urls";

const createContent = async (data: Content) => {
  await axios.post(`${CONTENTS}/create`, data)
}
const updateContent = async (data: Content) => {
  await axios.post(`${CONTENTS}/update`, data)
}
const deleteContent = async (id: string) => {
  await axios.post(`${CONTENTS}/delete`, {contentId: id})
}
const getContentById = async (id) => {
  const res = await axios.get(`${CONTENTS}/` + id)
  return res.data.data;
}

export {createContent, updateContent, deleteContent, getContentById}
