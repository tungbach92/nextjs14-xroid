import dayjs from "dayjs";

export const zoneHHmm = (time) => {
    return dayjs(time).format("HH:mm")
}
export const zoneMM = (time) => {
    return dayjs(time).format("mm")
}

export const zoneDateTime = (time) => {
    return dayjs(time).format("YYYY-MM-DD HH:mm")
}

export const zoneDateTimeSecond = (time) => {
    return dayjs(time).format("YYYY-MM-DD HH:mm:ss")
}

export const zoneDatedd = (time) => {
    return dayjs(time).format("dd")
}

export const zoneDate = (time) => {
    return dayjs(time).format("YYYY-MM-DD")
}

export const zoneDateJapan = (time) => {
    return dayjs(time).format("YYYY年MM月DD日")
}

export const zoneDateSlash = (time) => {
    return dayjs(time).format("YYYY/MM/DD")
}
