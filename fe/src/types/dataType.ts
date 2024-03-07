export type MarkData = {
    id?: String
    markName?: String
    markColor?: String
}

export type UserData = {
    id?: String
    userName?: String
    userEmail?: String
    userAddress?: String
    userPhone?: String
    userPassword?: String
    userRole?: String
}

export type WorkData = {
    id?: String
    workTitle?: String
    workDateStart?: Date
    workDateEnd?: Date
    markId?: String
    userId?: String
}

export type WorkInfo = {
    id?: String
    workTitle?: String
    workDateStart?: Date
    workDateEnd?: Date
    markId?: MarkData
    userId?: UserData
}

export type WorkerData = {
    id?: String
    userId?: String
    workId?: String
    workerCreateAt?: Date
    workerNote?: String
    workerStatus?: 0 | 1 | 2
}