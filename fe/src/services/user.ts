import NotesAPI from "~/api";
import { APIType } from "~/types/apiType";
import { UserData } from "~/types/dataType";

class User extends NotesAPI {
    public async signUp(data: UserData): Promise<APIType<undefined>> {
        return await this.postAPI('/user/create', data)
    }

    public async signIn(data: UserData): Promise<APIType<UserData>> {
        return await this.postAPI('/user/login', data)
    }

    public async getCount(): Promise<APIType<Number>> {
        return await this.getAPI('/user/count')
    }

    public async searchAPI(userEmail: string): Promise<APIType<UserData>> {
        return await this.getAPI(`/user/search/${userEmail}`)
    }

    public async getInfo(id: string): Promise<APIType<UserData>> {
        return await this.getAPI(`/user/info/${id}`)
    }

    public async update(id: String, data: UserData): Promise<APIType<UserData>> {
        return await this.putAPI(`/user/${id}`, data)
    }
}

export default new User()