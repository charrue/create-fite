import Cookies from "js-cookie";

export const __DEV__ = ["development", "mock"].indexOf(process.env.NODE_ENV) !== -1;

const TokenKey = "__SYSTEM_TOKEN__";

export function getToken() {
  return Cookies.get(TokenKey) || "";
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, { expires: 7 });
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}
