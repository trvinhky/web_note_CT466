import NotesAPI from "~/api";
import { APIType } from "~/types/apiType";
import { UserData } from "~/types/dataType";

class User extends NotesAPI {
    public async signUp(data: UserData): Promise<APIType<UserData>> {
        return await this.postAPI('/user/create', data)
    }

    public async signIn(data: UserData): Promise<APIType<UserData>> {
        return await this.postAPI('/user/login', data)
    }

    public async search(email: String): Promise<APIType<UserData>> {
        return await this.getAPI(`/user/search?email=${email}`)
    }

    public async getInfo(id: String): Promise<APIType<UserData>> {
        return await this.getAPI(`/user/info?id=${id}`)
    }
}

export default new User()