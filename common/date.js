import moment from "moment"

function isDate(d) {
  return d instanceof Date && !isNaN(d.valueOf());
}

const toMs = (ts) => {
  if (!ts) return null;
  if (Number.isInteger(ts)) return ts;
  if (isDate(ts)) return ts.getTime();
  if (moment.isMoment(ts)) return ts.valueOf();
  if (ts?.seconds || ts?._seconds) {
    return ((ts?.seconds || ts?._seconds) +
      (ts?.nanoseconds || ts?._nanoseconds || 0) / 1e9) * 1000;
  }
  // trường hợp còn lại sẽ xử lý với Date String;
  const date = new Date(ts);
  return date?.getTime();
};

const toDate = (ts) => {
  return new Date(toMs(ts))
};

export {
  toDate,
  toMs
}
