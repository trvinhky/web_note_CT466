import { RootState } from "./index";

export const userInfoSelector = (state: RootState) => state.users.info;
export const userIsLoginSelector = (state: RootState) => state.users.isLogin;