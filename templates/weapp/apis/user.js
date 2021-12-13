const { service } = require("../core/request/index");

export const userLogin = (data = {}) => service.post("/login", data);

export const saveUserPhone = (data = {}) => service.post("/phone", data);

export const getUserDetail = (data = {}) => service.post("/getUserDetail", data);

export const saveUserInfo = (data = {}) => service.post("/oauth", data);

export const getUserInfo = (data = {}) => service.post("/getUserDetail", data);
