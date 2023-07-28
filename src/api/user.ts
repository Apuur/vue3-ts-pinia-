import request from "@/utils/request";

// TODO：登录请求接口类型限制
// 1.请求体参数类型
export interface userLoginInfoType {
  username: string;
  password: string;
}
// 2.登录功能返回值类型
export interface loginReturnType {
  token: string;
}

// TODO:获取用户信息接口类型限制
// 1.返回用户信息类型
export interface userInfoType {
  routes: string[];
  buttons: string[];
  roles: string[];
  name: string;
  avatar: string;
}

// 1.登录请求接口
// POST /admin/acl/index/login
// login
export const reqLogin = (userInfo: userLoginInfoType) => {
  return request.post<null, loginReturnType>(
    `/admin/acl/index/login`,
    userInfo
  );
};

// 2.退出登录接口
// POST /admin/acl/index/logout
// logout
export const reqLogout = () => {
  return request.post<null, null>(`/admin/acl/index/logout`);
};

// 3.获取用户信息接口
// GET /admin/acl/index/info
// info
export const reqUserInfo = () => {
  return request.get<null, userInfoType>(`/admin/acl/index/info`);
};
