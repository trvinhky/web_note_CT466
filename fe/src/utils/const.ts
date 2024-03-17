export const DATEFORMATFULL = 'YYYY-MM-DD HH:mm:ss';
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