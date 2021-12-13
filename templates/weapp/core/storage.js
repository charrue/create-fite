const getStorageSync = (key) => {
  try {
    return (wx.getStorageSync(key) || {});
  } catch (e) {
    console.warn(e);
    return {};
  }
};

const CacheKey = "__system_cache_key__";
export const createStorage = (maxAge) => {
  return {
    get(key) {
      const now = Date.now();
      const dataValue = getStorageSync(CacheKey);
      if (!dataValue[key]) return undefined;

      const { t: expiryTime, v: originValue } = dataValue[key];

      // eslint-disable-next-line eqeqeq
      if (expiryTime == -1) {
        return originValue;
      }

      // 如果变量的过期时间 < 当前时间，则过期
      if (expiryTime < now) {
        delete dataValue[key];
        wx.setStorageSync(CacheKey, dataValue);
        return undefined;
      }
      // 过期时间 = 当前时间 + 最大有效时间
      dataValue[key].t = now + maxAge;
      wx.setStorageSync(CacheKey, dataValue);
      return originValue;
    },
    set(key, value, _maxAge) {
      const now = Date.now();
      const dataValue = getStorageSync(CacheKey);
      dataValue[key] = {
        t: now + (_maxAge || maxAge),
        v: value,
      };
      wx.setStorageSync(CacheKey, dataValue);
    },
    remove(key) {
      const dataValue = getStorageSync(CacheKey);
      if (!dataValue[key]) return true;
      delete dataValue[key];
      wx.setStorageSync(CacheKey, dataValue);
      return true;
    },
  };
};

export const wxStorage = createStorage(1000);
