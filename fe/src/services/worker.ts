import NotesAPI from "~/api";
import { APIType } from "~/types/apiType";
import { WorkerData } from "~/types/dataType";

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
}

export default new Worker()