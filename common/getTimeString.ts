export const getTimeString = (time) => {
  if (typeof time === "string") {
    return time;
  }
  if (time?.toDate instanceof Function) {
    return time.toDate()
  }
  return time
}
