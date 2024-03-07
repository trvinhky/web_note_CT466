import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_URL_BACKEND;

class NotesAPI {
    protected async getAPI(url: string) {
        try {
            const res = await axios.get(url)
            return (res.status === 200 || res.status === 201) && res.data
        } catch (e) {
            console.log(e)
        }
    }

    protected async putAPI(url: string, data: object) {
        try {
            const res = await axios.put(url, data)
            return (res.status === 200 || res.status === 201) && res.data
        } catch (e) {
            console.log(e)
        }
    }

    protected async deleteAPI(url: string) {
        try {
            const res = await axios.delete(url)
            return (res.status === 200 || res.status === 201) && res.data
        } catch (e) {
            console.log(e)
        }
    }

    protected async postAPI(url: string, data: object) {
        try {
            const res = await axios.post(url, data)
            return (res.status === 200 || res.status === 201) && res.data
        } catch (e) {
            console.log(e)
        }
    }
}

export default NotesAPI