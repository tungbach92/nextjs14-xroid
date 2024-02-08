import axios from "axios";

const getListFolder = async (type: string) => {
  const res = await axios.get(`/v2/folders/${type}`)
  if (res.status === 200)
    return res?.data?.data?.folders
  return []

}
const createFolder = async (data) => {
  return await axios.post('/v2/folders/create', data)
}
const editFolder = async (data) => {
  return await axios.post('/v2/folders/update', data)
}
const deleteFolder = async (id) => {
  return await axios.post(`/v2/folders/delete/${id}`)
}
export {
  getListFolder,
  createFolder,
  editFolder,
  deleteFolder
}
