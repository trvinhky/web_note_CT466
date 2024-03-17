export type MarkData = {
    _id?: String
    id?: String
    markName?: String
    markColor?: String
}

export type UserData = {
    _id?: String
    id?: String
    userName?: String
    userEmail?: String
    userAddress?: String
    userPhone?: String
    userPassword?: String
    userRole?: String
}

export type WorkData = {
    _id?: String
    id?: String
    workTitle?: String
    workDateStart?: String
    workDateEnd?: String
    markId?: String
    userId?: String
}

export type WorkInfo = {
    _id?: String
    id?: String
    workTitle?: String
    workDateStart?: String
    workDateEnd?: String
    markId?: MarkData
    userId?: UserData
}

export type WorkerData = {
    _id?: String
    id?: String
    userId?: String
    workId?: String
    workerCreateAt?: String
    workerNote?: String
    workerStatus?: 0 | 1 | 2
}

export type WorkerInfo = {
    _id?: String
    id?: String
    userId?: String
    workId?: WorkInfo
    workerCreateAt?: String
    workerNote?: String
    workerStatus?: 0 | 1 | 2
}

export type Members = {
    _id?: String
    id?: String
    userId?: UserData
    workId?: String
    workerCreateAt?: String
    workerNote?: String
    workerStatus?: 0 | 1 | 2
}