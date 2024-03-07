import NotesAPI from "~/api";
import { APIType } from "~/types/apiType";
import { WorkData, WorkInfo } from "~/types/dataType";

class Work extends NotesAPI {
    public async create(data: WorkData): Promise<APIType<undefined>> {
        return await this.postAPI('/work/create', data)
    }

    public async update(id: String, userId: String, data: WorkData): Promise<APIType<WorkData>> {
        return await this.putAPI(`/work/edit?id=${id}&userId=${userId}`, data)
    }

    public async delete(id: String, userId: String): Promise<APIType<undefined>> {
        return await this.deleteAPI(`/work/delete?id=${id}&userId=${userId}`)
    }

    public async getInfo(id: String): Promise<APIType<WorkInfo>> {
        return await this.getAPI(`/work/info/${id}`)
    }
}

export default new Work()