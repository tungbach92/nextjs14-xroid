import axios from "axios";
import {CHARACTER} from "@/app/auth/urls";
import {DataCheck, Motion, Voice} from "@/app/types/types";

const createCharacter = async (data) => {
  await axios.post(`${CHARACTER}/create`, data)
}

const updateCharacter = async (data) => {
  await axios.put(`${CHARACTER}/update`, data)
}

const deleteCharacter = async (characterId) => {
  await axios.post(`${CHARACTER}/${characterId}/delete`)
}

const createCharacterVoice = async (characterId, data) => {
  await axios.post(`${CHARACTER}/${characterId}/voices/create`, data)
}

const updateCharacterVoice = async (characterId, data) => {
  await axios.put(`${CHARACTER}/${characterId}/voices/update`, data)
}

const deleteCharacterVoice = async (characterId, voiceId) => {
  await axios.post(`${CHARACTER}/${characterId}/voices/${voiceId}/delete`)
}

const getCharacterVoiceDefault = async (characterId): Promise<Voice> => {
  const res = await axios.get(`${CHARACTER}/${characterId}/default`)
  return res.data.data
}
const getCharacterMotionDefault = async (characterId) => {
  const res = await axios.get(`${CHARACTER}/${characterId}/defaultMotion`)
  return res.data
}

const getAllCharacterVoice = async (characterId) => {
  const res = await axios.get(`${CHARACTER}/${characterId}/voices`)
  return res.data.data
}

const getCharacterVoice = async (characterId, voiceId) => {
  const res = await axios.get(`${CHARACTER}/${characterId}/voices/${voiceId}`)
  return res.data
}

const setCharacterVoiceDefault = async (characterId, voiceId) => {
  await axios.post(`${CHARACTER}/${characterId}/voices/default`, voiceId)
}
const setCharacterMotionDefault = async (characterId, motionId) => {
  await axios.post(`${CHARACTER}/${characterId}/motions/default`, motionId)
}


const getCharacterMotion = async (characterId): Promise<Motion[]> => {
  const res = await axios.get(`${CHARACTER}/${characterId}/motions`)
  return res.data.data
}

const createCharacterMotion = async (characterId, data) => {
  await axios.post(`${CHARACTER}/${characterId}/motions/create`, data)
}

const updateCharacterMotion = async (characterId, data) => {
  await axios.post(`${CHARACTER}/${characterId}/motions/update`, data)
}

const deleteCharacterMotion = async (characterId, motionId) => {
  await axios.post(`${CHARACTER}/${characterId}/motions/${motionId}/delete`)
}

const getCharacterPoses = async (characterId) => {
  const res = await axios.get(`${CHARACTER}/${characterId}/poses`)
  return res.data
}

const createCharacterPoses = async (characterId, data) => {
  await axios.post(`${CHARACTER}/${characterId}/poses/create`, data)
}

const updateCharacterPose = async (characterId, data) => {
  await axios.post(`${CHARACTER}/${characterId}/poses/update`, data)
}

const deleteCharacterPose = async (characterId, poseId) => {
  await axios.post(`${CHARACTER}/${characterId}/poses/${poseId}/delete`)
}

const checkCharacterDelete = async (characterId): Promise<DataCheck> => {
  const res = await axios.get(`${CHARACTER}/${characterId}/check`)
  return res.data.data
}

export {
  createCharacter,
  updateCharacter,
  deleteCharacter,
  createCharacterVoice,
  updateCharacterVoice,
  deleteCharacterVoice,
  checkCharacterDelete,
  getCharacterVoiceDefault,
  setCharacterVoiceDefault,
  getAllCharacterVoice,
  getCharacterMotion,
  createCharacterMotion,
  getCharacterPoses,
  createCharacterPoses,
  getCharacterMotionDefault,
  setCharacterMotionDefault,
  updateCharacterMotion,
  updateCharacterPose,
  deleteCharacterMotion,
  deleteCharacterPose,
  getCharacterVoice
}
