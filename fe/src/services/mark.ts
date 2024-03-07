import NotesAPI from "~/api";
import { APIType } from "~/types/apiType";
import { MarkData } from "~/types/dataType";

class Mark extends NotesAPI {
    public async create(data: MarkData): Promise<APIType<undefined>> {
        return await this.postAPI('/mark/create', data)
    }

    public async getAll(): Promise<APIType<MarkData>> {
        return await this.getAPI('/mark/all')
    }

    public async delete(id: String): Promise<APIType<undefined>> {
        return await this.deleteAPI(`/mark/${id}`)
    }
}

export default new Mark()