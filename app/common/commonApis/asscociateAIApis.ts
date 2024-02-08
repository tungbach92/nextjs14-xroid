import {ASSOCIATE_AI} from "@/app/auth/urls";
import {QaDocTemplate} from "@/app/types/qaDocTemplate";
import axios from "axios";

const createAssociateAi = async (data: QaDocTemplate) => {
  return await axios.post(`${ASSOCIATE_AI}/create`, data)
}

const updateAssociateAi = async (data: QaDocTemplate) => {
  return await axios.post(`${ASSOCIATE_AI}/update`, data)
}

const deleteAssociateAi = async (id: string) => {
  return await axios.post(`${ASSOCIATE_AI}/delete/${id}`)
}

export {
  createAssociateAi,
  updateAssociateAi,
  deleteAssociateAi
}
