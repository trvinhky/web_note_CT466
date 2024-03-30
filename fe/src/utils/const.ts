import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

export const DATEFORMATFULL = 'YYYY-MM-DD HH:mm:ss';
export const DATEFORMAT = 'YYYY-MM-DD';
export const TIMEFORMAT = 'HH:mm:ss';

export const handleTime = (time: String) => {
    const date = new Date(time as string);

    date.setFullYear(2024, 0, 31); // Set year, month (0-based), and date
    date.setHours(0, 5, 0); // Set hours, minutes, and seconds

    return ('0' + date.getDate()).slice(-2) + '-' +
        ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
        date.getFullYear() + ' ' +
        ('0' + date.getHours()).slice(-2) + ':' +
        ('0' + date.getMinutes()).slice(-2) + ':' +
        ('0' + date.getSeconds()).slice(-2);
}

dayjs.extend(utc);
dayjs.extend(timezone);

export const convertDate = (time: String, format: String) => dayjs.utc(time as string).local().format(format as string)