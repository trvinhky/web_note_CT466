import NotesAPI from "~/api";
import { APIType } from "~/types/apiType";
import { WorkData, WorkInfo } from "~/types/dataType";

type QueryValue = {
    userId: String
    status?: Boolean
    year?: Number
    month?: Number
}

class Work extends NotesAPI {
    public async create(data: WorkData): Promise<APIType<WorkData>> {
        return await this.postAPI('/work/create', data)
    }

    public async update(id: String, data: WorkData): Promise<APIType<WorkData>> {
        return await this.putAPI(`/work/edit?id=${id}`, data)
    }

    public async delete(id: String): Promise<APIType<undefined>> {
        return await this.deleteAPI(`/work/delete/${id}`)
    }

    public async getInfo(id: String): Promise<APIType<WorkInfo>> {
        return await this.getAPI(`/work/info/${id}`)
    }

    public async getAll(query: QueryValue): Promise<APIType<WorkInfo>> {
        let queryString = `userId=${query.userId}`

        if (query.status) {
            queryString += `&status=${query.status}`
        }

        if (query.year) {
            queryString += `&year=${query.year}`
        }

        if (query.month) {
            queryString += `&month=${query.month}`
        }
        return await this.getAPI(`/work/all?${queryString}`)
    }

    public async getCurrent(query: QueryValue): Promise<APIType<WorkInfo>> {
        let queryString = `userId=${query.userId}`

        if (query.status) {
            queryString += `&status=${query.status}`
        }
        return await this.getAPI(`/work/all?${queryString}`)
    }
}

export default new Work()