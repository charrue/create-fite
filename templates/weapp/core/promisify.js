/**
 * 微信原生api promise化
 */
import { promisifyAll } from "miniprogram-api-promise";

/*
 * 创建 wxp 变量 以及 wx.pro 即微信自定义属性
 * 将 wxp 和 wx.pro 指向一个空对象
 * 因为对象是引用类型的数据，所以 wxp 和 wx.pro 指向同一个内存空间
 */
// eslint-disable-next-line no-multi-assign
export const wxp = (wx.pro = {});

promisifyAll(wx, wxp);
