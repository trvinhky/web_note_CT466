export type APIType<T> = {
    errorCode: Number
    message: String
    data?: T | Array<T>
    error?: String
}