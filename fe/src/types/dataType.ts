export type UserData = {
    _id?: String
    userName?: String
    userEmail?: String
    userPassword?: String
}

export type GroupData = {
    _id?: String
    groupName: String
    groupCreateAt?: String
}

export type GroupInfoData = {
    _id?: String
    groupId: String
    userId: String
    groupInfoAdmin?: Boolean
    groupInfoStatus?: Boolean
}

export type Members = {
    user: UserData
    admin: Boolean,
    status: Boolean
}

export type GroupInfoDataItem = {
    _id?: String
    groupId: GroupData
    userId: String
    groupInfoAdmin?: Boolean
    groupInfoStatus?: Boolean
}

export type GroupInfoItem = {
    group: GroupData
    members: Members[]
}

export type WorkData = {
    _id?: String
    workTitle?: String
    workDescription?: String
    workDateStart?: String
    workDateEnd?: String
    groupId?: String
}

export type WorkInfo = {
    _id?: String
    workTitle?: String
    workDescription?: String
    workDateStart?: String
    workDateEnd?: String
    groupId?: GroupData
}

export type WorkInfoData = {
    _id?: String
    workId: String
    groupId: String
    userId: String
    workInfoStatus?: Boolean
}

export type WorkInfoDataItem = {
    _id?: String
    workId: WorkData
    groupId: GroupData
    userId: string
    workInfoStatus?: Boolean
}

export type MemberType = {
    userId: UserData,
    workInfoStatus: Boolean
}

export type WorkDetail = {
    workId: WorkData
    groupId: GroupData
    members: MemberType[]
}