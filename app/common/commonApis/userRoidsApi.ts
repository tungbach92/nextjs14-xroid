import {ROIDS_TEMPLATE} from "@/app/auth/urls";
import axios from "axios";

export const createdUroidChapterByUser = async ()  => {
  const res = await axios.get(`${ROIDS_TEMPLATE}`);
  return res.data;
}

export const getUroidsByTemplateId = async (id: string) => {
  const res = await axios.get(`${ROIDS_TEMPLATE}/${id}/characters`);
  return res.data;
}
