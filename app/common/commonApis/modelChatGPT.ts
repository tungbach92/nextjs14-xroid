import axios from "axios";
import {MENTOROID_V2} from "@/app/common/constants";
import {Model} from "@/app/types/types";

export const getAllModels = async (): Promise<Model[]> => {
  const {data} = await axios.get(`${MENTOROID_V2}/chatGPT/models`)
  return data.data
}
