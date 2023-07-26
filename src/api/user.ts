import request from "@/utils/request";

// 登录请求类型限制
export interface loginInfoType {
  username: string;
  password: string;
}
export interface loginInfoReturnType {
  token: string;
}

// 请求用户信息返回值类型
export interface userInfoType {
  routes: string[];
  buttons: string[];
  roles: string[];
  name: string;
  avatar: string;
}

// 1.登录接口请求
// POST /admin/acl/index/login
export const reqLogin = (userInfo: loginInfoType) => {
  return request.post<null, loginInfoReturnType>(
    `/admin/acl/index/login`,
    userInfo
  );
};

// 2.退出登录请求
// POST /admin/acl/index/logout
export const reqLogout = () => {
  return request.post<null, null>(`/admin/acl/index/logout`);
};

// 3.请求用户信息
// GET /admin/acl/index/info
export const reqUserInfo = () => {
  return request.get<null, userInfoType>(`/admin/acl/index/info`);
};
