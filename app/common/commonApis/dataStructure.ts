import axios from "axios";
import {DATA_STRUCTURE_URL} from "@/app/auth/urls";
import {DataStructure} from "@/app/types/types";

const getDataStructure = async (folderId: string) => {
  const res = await axios.get(`${DATA_STRUCTURE_URL}?folderId=${folderId}`)
  return res.data.data;
}
const getDataStructureById = async (id) => {
  const res = await axios.get(`${DATA_STRUCTURE_URL}/` + id)
  return res.data.data;
}
const createDataStructure = async (data: DataStructure) => {
  return await axios.post(`${DATA_STRUCTURE_URL}/create`, data)
}
const updateDataStructure = async (data: any) => {
  return await axios.post(`${DATA_STRUCTURE_URL}/update`, data)
}
const deleteDataStructure = async (id) => {
  return await axios.post(`${DATA_STRUCTURE_URL}/delete`, {id: id})
}
const deleteDataStructureItem = async (structureID: string, itemId: string) => {
  return await axios.post(`${DATA_STRUCTURE_URL}/${structureID}/delete/${itemId}`)
}

const createDataStructureList = async (list: DataStructure[]) => {
  return await axios.post(`${DATA_STRUCTURE_URL}/list/create`, {list})
}

const updateDataStructureList = async (list: DataStructure[]) => {
  return await axios.post(`${DATA_STRUCTURE_URL}/list/update`, {list})
}

const deleteDataStructureList = async (ids: DataStructure[]) => {
  return await axios.post(`${DATA_STRUCTURE_URL}/list/delete`, {ids})
}

export {
  getDataStructure,
  getDataStructureById,
  createDataStructure,
  updateDataStructure,
  deleteDataStructure,
  createDataStructureList,
  updateDataStructureList,
  deleteDataStructureList,
  deleteDataStructureItem
}
