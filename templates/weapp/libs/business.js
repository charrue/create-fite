import { TOKEN_KEY } from "./constants";

export const getToken = () => wx.getStorageSync(TOKEN_KEY);

export const setToken = (val) => wx.setStorageSync(TOKEN_KEY, val);

export const removeToken = () => wx.removeStorageSync(TOKEN_KEY);
