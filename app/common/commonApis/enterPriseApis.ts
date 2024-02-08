import axios from "axios";
import {USER} from "@/app/auth/urls";
type EnterpriseData = {
  studioKey: string,
  openAPIKey: string,
  endpoint: string,
  isPublic: boolean,
}
const createEnterprise = async (data: EnterpriseData) => {
  return await axios.post(`${USER}/enterprise-setting`, data)
}

const getEnterprise = async (id: string) => {
  const res = await axios.get(`${USER}/enterprise-setting?userId=${id}`)
  return res.data.data;
}

export {
  createEnterprise,
  getEnterprise
}
