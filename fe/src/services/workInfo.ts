import NotesAPI from "~/api";
import { APIType } from "~/types/apiType";
import { WorkDetail, WorkInfoData, WorkInfoDataItem } from "~/types/dataType";
import { ParamsFuncAll } from "~/types/global";

class WorkInfo extends NotesAPI {
    public async create(data: WorkInfoData): Promise<APIType<WorkInfoData>> {
        return await this.postAPI('/workInfo/create', data)
    }

    public async update(data: WorkInfoData): Promise<APIType<WorkInfoData>> {
        return await this.putAPI(`/workInfo/edit?groupId=${data.groupId}&userId=${data.userId}&workId=${data.workId}`, data)
    }

    public async delete(groupId: String, workId: String): Promise<APIType<undefined>> {
        return await this.deleteAPI(`/workInfo/delete?groupId=${groupId}&workId=${workId}`)
    }

    public async getOne(groupId: String, workId: String): Promise<APIType<WorkDetail>> {
        return await this.getAPI(`/workInfo/info?groupId=${groupId}&workId=${workId}`)
    }

    public async getAll(data: ParamsFuncAll): Promise<APIType<WorkInfoDataItem>> {
        let queryString = ''
        if (data.status !== undefined) {
            queryString += `&status=${data.status}`
        }

        if (data.year) {
            queryString += `&year=${data.year}`
        }

        if (data.month) {
            queryString += `&month=${data.month}`
        }
        return await this.getAPI(`/workInfo/all?groupId=${data.groupId}&userId=${data.userId}${queryString}`)
    }

    public async getAllCurrent(groupId: String, userId: String, count?: Number): Promise<APIType<WorkInfoDataItem>> {
        const queryString = count ? `&count=${count}` : ''
        return await this.getAPI(`/workInfo/current?groupId=${groupId}&userId=${userId}${queryString}`)
    }
}

export default new WorkInfo()