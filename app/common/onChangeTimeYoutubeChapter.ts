import React from "react";
import {toNumber} from "lodash";
import {toast} from "react-toastify";
import {VimeoChapter, YoutubeChapter} from "@/app/types/types";

export const handleChangeTime = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  type: string,
  metadata: YoutubeChapter | VimeoChapter,
  setMetadata: React.Dispatch<React.SetStateAction<YoutubeChapter | VimeoChapter>>) => {
  const value = e.target.value;
  const startHoursToSeconds = metadata?.timeStartEnd?.startHour * 3600
  const startMinutesToSeconds = metadata?.timeStartEnd?.startMinute * 60
  const startSeconds = metadata?.timeStartEnd?.startSecond
  const endHoursToSeconds = metadata?.timeStartEnd?.endHour * 3600
  const endMinutesToSeconds = metadata?.timeStartEnd?.endMinute * 60
  const endSeconds = metadata?.timeStartEnd?.endSecond
  const errorMessage = "開始時間は終了時間より前に設定してください。" //start time must be before end time
  const errorMessage2 = "開始時間は動画の長さを超えることはできません。" //start time must be < video duration
  const errorMessage3 = "終了時間は動画の長さを超えることはできません。" //end time must be < video duration
  const errorMessage4 = "終了時間は開始時間より後に設定してください。" //end time must be > start time
  switch (type) {
    case 'startHour':
      const totalSeconds = toNumber(value) * 3600 + startMinutesToSeconds + startSeconds
      if (totalSeconds > metadata?.duration) {
        toast.error(errorMessage2, {autoClose: 3000})
        return
      }
      if (totalSeconds > endHoursToSeconds + endMinutesToSeconds + endSeconds) {
        toast.error(errorMessage, {autoClose: 3000})
        return
      }
      break
    case 'startMinute':
      const totalSeconds2 = startHoursToSeconds + toNumber(value) * 60 + startSeconds
      if (totalSeconds2 > metadata?.duration) {
        toast.error(errorMessage2, {autoClose: 3000})
        return
      }
      if (totalSeconds2 > endHoursToSeconds + endMinutesToSeconds + endSeconds) {
        toast.error(errorMessage, {autoClose: 3000})
        return
      }
      if (toNumber(value) > 59) {
        return setMetadata({
          ...metadata,
          timeStartEnd: {
            ...metadata?.timeStartEnd,
            startHour: metadata?.timeStartEnd?.startHour + Math.floor(toNumber(value) / 60),
            startMinute: toNumber(value) % 60
          }
        })
      }
      break
    case 'startSecond':
      if (startHoursToSeconds + startMinutesToSeconds + toNumber(value) > metadata?.duration) {
        toast.error(errorMessage2, {autoClose: 3000})
        return
      }
      if (startHoursToSeconds + startMinutesToSeconds + toNumber(value) > endHoursToSeconds + endMinutesToSeconds + endSeconds) {
        toast.error(errorMessage, {autoClose: 3000})
        return
      }
      if (toNumber(value) > 59 && toNumber(value) < 3600) {
        return setMetadata({
          ...metadata,
          timeStartEnd: {
            ...metadata?.timeStartEnd,
            startMinute: toNumber(metadata?.timeStartEnd?.startMinute) + Math.floor(toNumber(value) / 60),
            startSecond: toNumber(value) % 60
          }
        })
      }
      break
    case 'endHour':
      if (toNumber(value) * 3600 + endMinutesToSeconds + endSeconds > metadata?.duration) {
        console.log("endHour")
        toast.error(errorMessage3, {autoClose: 3000})
        return
      }
      if (toNumber(value) * 3600 + endMinutesToSeconds + endSeconds < startHoursToSeconds + startMinutesToSeconds + startSeconds) {
        toast.error(errorMessage4, {autoClose: 3000})
        return
      }
      break
    case 'endMinute':
      if (endHoursToSeconds + toNumber(value) * 60 + endSeconds > metadata?.duration) {
        toast.error(errorMessage3, {autoClose: 3000})
        return
      }
      if (endHoursToSeconds + toNumber(value) * 60 + endSeconds < startHoursToSeconds + startMinutesToSeconds + startSeconds) {
        toast.error(errorMessage4, {autoClose: 3000})
        return
      }
      if (toNumber(value) > 59) {
        return setMetadata({
          ...metadata,
          timeStartEnd: {
            ...metadata?.timeStartEnd,
            endHour: metadata?.timeStartEnd?.endHour + Math.floor(toNumber(value) / 60),
            endMinute: toNumber(value) % 60
          }
        })
      }
      break
    case 'endSecond':
      if (endHoursToSeconds + endMinutesToSeconds + toNumber(value) > metadata?.duration) {
        toast.error(errorMessage3, {autoClose: 3000})
        return
      }
      if (endHoursToSeconds + endMinutesToSeconds + toNumber(value) < startHoursToSeconds + startMinutesToSeconds + startSeconds) {
        toast.error(errorMessage4, {autoClose: 3000})
        return
      }
      if (toNumber(value) > 59 && toNumber(value) < 3600) {
        return setMetadata({
          ...metadata,
          timeStartEnd: {
            ...metadata?.timeStartEnd,
            endMinute: toNumber(metadata?.timeStartEnd?.endMinute) + Math.floor(toNumber(value) / 60),
            endSecond: toNumber(value) % 60
          }
        })
      }
      break
    default:
      break
  }
  setMetadata({...metadata, timeStartEnd: {...metadata?.timeStartEnd, [type]: toNumber(value)}})
}
