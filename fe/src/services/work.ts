import NotesAPI from "~/api";
import { APIType } from "~/types/apiType";
import { WorkData } from "~/types/dataType";

class Work extends NotesAPI {
    public async create(data: WorkData): Promise<APIType<WorkData>> {
        return await this.postAPI('/work/create', data)
    }

    public async update(id: String, data: WorkData): Promise<APIType<WorkData>> {
        return await this.putAPI(`/work/edit?id=${id}`, data)
    }

    public async delete(id: String): Promise<APIType<undefined>> {
        return await this.deleteAPI(`/work/delete?id=${id}`)
    }
}

export default new Work()