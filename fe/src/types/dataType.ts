export type UserData = {
    _id?: String
    userName?: String
    userEmail?: String
    userPassword?: String
}

export type WorkData = {
    _id?: String
    workTitle?: String
    workDescription?: String
    workDateStart?: String
    workDateEnd?: String
    workStatus?: Boolean
    userId?: String
}

export type WorkInfo = {
    _id?: String
    workTitle?: String
    workDescription?: String
    workDateStart?: String
    workDateEnd?: String
    workStatus?: Boolean
    userId?: UserData
}