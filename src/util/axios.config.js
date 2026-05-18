import axios from "axios";
import store from "@/store";
import { ElMessage } from "element-plus";

axios.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem("token");
        config.headers.Authorization = `Bearer ${token}`
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    function (response) {
        const { authorization } = response.headers;
        authorization && localStorage.setItem("token", authorization)
        return response;
    },
    function (error) {
        if (!error.response) {
            ElMessage.error("网络连接失败，请检查网络");
            return Promise.reject(error);
        }
        const { status } = error.response;
        if (status === 401) {
            localStorage.removeItem("token");
            store.commit("clearUserInfo");
            window.location.href = "#/login";
        } else {
            const message = error.response.data?.msg || error.response.data?.message || error.message || "请求失败";
            ElMessage.error(message);
        }
        return Promise.reject(error);
    }
);
