import { defineStore } from "pinia";
import { getToken, removeToken, setToken } from "../utils/token-utils";
import type { UserInfoState } from "./interface";
import { ElMessage } from "element-plus";
import { staticRoutes } from "@/router/routes";

import { reqLogin, reqLogout, reqUserInfo } from "@/api/user";

/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 *
 */
export const useUserInfoStore = defineStore("userInfo", {
  state: (): UserInfoState => ({
    token: getToken() as string,
    userInfo: {
      routes: [],
      buttons: [],
      roles: [],
      name: "",
      avatar: "",
    },
    menuRoutes: [],
  }),

  actions: {
    // login (username: string, password: string) {
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       if (username==='admin' && password==='111111') {
    //         const token = 'token-atguigu'
    //         setToken(token)
    //         this.token = token
    //         resolve(token)
    //       } else {
    //         reject(new Error('用户名或密码错误!'))
    //         ElMessage.error('用户名或密码错误!')
    //       }
    //     }, 1000)
    //   })
    // },
    async login(username: string, password: string) {
      try {
        const result = await reqLogin({ username, password });
        // console.log(result);
        this.token = result.token;
        setToken(result.token);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    // getInfo() {
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       this.name = "admin";
    //       this.avatar =
    //         "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif";
    //       this.menuRoutes = staticRoutes;
    //       resolve({ name: this.name, avatar: this.avatar, token: this.token });
    //     }, 1000);
    //   });
    // },
    // 获取用户信息
    async getInfo() {
      try {
        const result = await reqUserInfo();
        // console.log(result);
        this.userInfo = result;
        this.menuRoutes = staticRoutes;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    // 退出登录
    async getLogout() {
      try {
        await reqLogout();
        this.reset();
      } catch (error) {
        return Promise.reject(error);
      }
    },
    // 重置信息
    reset() {
      // 删除local中保存的token
      removeToken();
      // 提交重置用户信息的mutation
      this.token = "";
      this.userInfo = {
        routes: [],
        buttons: [],
        roles: [],
        name: "",
        avatar: "",
      };
    },
  },
});
