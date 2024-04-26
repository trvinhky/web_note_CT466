import NotesAPI from "~/api";
import { APIType } from "~/types/apiType";
import { GroupData } from "~/types/dataType";

class Group extends NotesAPI {
    public async create(data: GroupData): Promise<APIType<GroupData>> {
        return await this.postAPI('/group/create', data)
    }

    public async delete(id: String): Promise<APIType<undefined>> {
        return await this.deleteAPI(`/group/delete?id=${id}`)
    }

    public async update(data: GroupData): Promise<APIType<GroupData>> {
        return await this.putAPI(`/group/edit?id=${data._id}`, data)
    }

    public async getOne(name: String): Promise<APIType<GroupData>> {
        return await this.getAPI(`/group/one?name=${name}`)
    }
}

export default new Group()