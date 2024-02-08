import {OGP} from "@/app/auth/urls";
import axios from "axios";

export const getOgp = async (data : any) => {
  return await axios.post(`${OGP}`, data)
}
