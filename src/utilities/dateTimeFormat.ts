import moment from 'moment';

export function getDateString(date: Date): string {
  const format = 'yyyy/MM/DD';
  return moment(date).format(format);
}

export function getDateTimeString(date: Date | undefined): string {
  const format = 'yyyy/MM/DD HH:mm:ss';
  return moment(date).format(format);
}
