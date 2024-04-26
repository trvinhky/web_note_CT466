export const getIdFromCookie = (name: string) => {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.indexOf(`${name}=`) === 0) {
            return cookie.substring(`${name}=`.length, cookie.length);
        }
    }
    return null;
}

export const setIdFromCookie = (name: string, value: string) => {
    const currentDate = new Date();
    const expirationDate = new Date(currentDate.getTime() + (1 * 24 * 60 * 60 * 1000));
    const expires = expirationDate.toUTCString();

    document.cookie = `${name}=${value}; expires=` + expires + "; path=/";
}

export const deleteCookie = (name: string) => {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}