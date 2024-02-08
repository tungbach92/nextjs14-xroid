import axios from "axios";
import {MENTOROID_V2} from "@/app/common/constants";

const updateFolder = async (id, name, parentId) => {
  await axios.post(`${MENTOROID_V2}/folders/update`, {"id": id, "name": name, "parentId": parentId})
}

const deleteFolder = async (id: string) => {
  await axios.post(`${MENTOROID_V2}/folders/delete/${id}`, {id})
}

export {updateFolder, deleteFolder}
