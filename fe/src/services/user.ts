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
}

export default new User()