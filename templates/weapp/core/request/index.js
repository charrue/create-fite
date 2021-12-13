/**
 * axios应用微信小程序的适配器
 */
import axios from "axios";
import axiosApAdapter from "axios-miniprogram-adapter";
import { requestInterceptors, responseInterceptors } from "./interceptors";

axios.defaults.adapter = axiosApAdapter;

export const service = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

requestInterceptors.forEach((item) => {
  service.interceptors.request.use(...item);
});
responseInterceptors.forEach((item) => {
  service.interceptors.response.use(...item);
});
