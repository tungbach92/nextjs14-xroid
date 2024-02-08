export const convertISO8601 = (iso8601: string): number => {
  if (!iso8601) return 0;

  const durationRegex = /P(?:([0-9]*)D)?T(?:([0-9]*)H)?(?:([0-9]*)M)?(?:([0-9]*)S)?/;
  const matches = iso8601.match(durationRegex);
  if (!matches) {
    return 0; // Invalid duration, return 0 seconds
  }

  const days = parseInt(matches[1]) || 0;
  const hours = parseInt(matches[2]) || 0;
  const minutes = parseInt(matches[3]) || 0;
  const seconds = parseInt(matches[4]) || 0;

  const totalSeconds = days * 24 * 3600 + hours * 3600 + minutes * 60 + seconds;

  return totalSeconds;
}
