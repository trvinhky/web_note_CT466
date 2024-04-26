import NotesAPI from "~/api";
import { APIType } from "~/types/apiType";
import { GroupInfoData, GroupInfoDataItem, GroupInfoItem } from "~/types/dataType";

class GroupInfo extends NotesAPI {
    public async create(data: GroupInfoData): Promise<APIType<GroupInfoData>> {
        return await this.postAPI('/groupInfo/create', data)
    }

    public async addMember(data: GroupInfoData): Promise<APIType<GroupInfoData>> {
        return await this.postAPI('/groupInfo/add', data)
    }

    public async delete(data: GroupInfoData): Promise<APIType<undefined>> {
        return await this.deleteAPI(`/groupInfo/delete?groupId=${data.groupId}&userId=${data.userId}`)
    }

    public async update(data: GroupInfoData): Promise<APIType<GroupInfoData>> {
        return await this.putAPI(`/groupInfo/edit?groupId=${data.groupId}&userId=${data.userId}`, data)
    }

    public async getOne(groupId: String): Promise<APIType<GroupInfoItem>> {
        return await this.getAPI(`/groupInfo/one?groupId=${groupId}`)
    }

    public async getByUser(userId: String, status?: Boolean): Promise<APIType<GroupInfoDataItem>> {
        let url = `/groupInfo/by?userId=${userId}`
        if (status) {
            url += `&status=${status}`
        }

        return await this.getAPI(url)
    }
}

export default new GroupInfo()