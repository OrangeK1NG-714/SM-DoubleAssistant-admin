import axios from "axios";
import store from "@/store";

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
        const { status } = error.response || {};
        if (status === 401) {
            localStorage.removeItem("token");
            store.commit("clearUserInfo");
            window.location.href = "#/login";
        }
        return Promise.reject(error);
    }
);
