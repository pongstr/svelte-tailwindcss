import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export const dateToString = (date: Date | string): string =>
  dayjs(date).toString()

export const dateFromNow = (date: Date | string): string =>
  dayjs(date).fromNow().toString()

export const dateSimple = (
  date: Date | string,
  format = 'DD, MMM YYYY HH:MM a',
): string => dayjs(date).format(format)
