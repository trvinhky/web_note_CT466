import NotesAPI from "~/api";
import { APIType } from "~/types/apiType";
import { Members, WorkerData, WorkerInfo } from "~/types/dataType";

type queryValue = {
    userId: String
    year?: Number
    month?: Number
}

class Worker extends NotesAPI {
    public async create(data: WorkerData): Promise<APIType<undefined>> {
        return await this.postAPI('/worker/create', data)
    }

    public async update(userId: String, workId: String, data: WorkerData): Promise<APIType<WorkerData>> {
        return await this.putAPI(`/worker/edit?userId=${userId}&workId=${workId}`, data)
    }

    public async delete(userId: String, workId: String): Promise<APIType<undefined>> {
        return await this.deleteAPI(`/worker/delete?userId=${userId}&workId=${workId}`)
    }

    public async getAll(query: queryValue): Promise<APIType<WorkerInfo>> {
        let queryString = `userId=${query.userId}`

        if (query.year) {
            queryString += `&year=${query.year}`
        }

        if (query.month) {
            queryString += `&month=${query.month}`
        }

        return await this.getAPI(`/worker/options?${queryString}`)
    }

    public async getAllByStatus(userId: String, status: 0 | 1 | 2): Promise<APIType<WorkerInfo>> {
        return await this.getAPI(`/worker/work?userId=${userId}&status=${status}`)
    }

    public async getAllCurrent(userId: String): Promise<APIType<WorkerInfo>> {
        return await this.getAPI(`/worker/work-current/${userId}`)
    }

    public async getMembers(workId: String): Promise<APIType<Members>> {
        return await this.getAPI(`/worker/work/${workId}`)
    }
}

export default new Worker()