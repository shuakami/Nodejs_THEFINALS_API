const config = require('../config');

class Cache {
    constructor() {
        this.cache = new Map();
    }

    // 生成缓存key
    _generateKey(key) {
        return typeof key === 'string' ? key : JSON.stringify(key);
    }

    // 获取缓存
    get(key) {
        const cacheKey = this._generateKey(key);
        const item = this.cache.get(cacheKey);
        
        if (!item) return null;
        
        if (Date.now() > item.expiry) {
            this.cache.delete(cacheKey);
            return null;
        }
        
        return item.value;
    }

    // 设置缓存
    set(key, value, ttl = config.cache.ttl) {
        const cacheKey = this._generateKey(key);
        this.cache.set(cacheKey, {
            value,
            expiry: Date.now() + (ttl * 1000)
        });
    }

    // 删除缓存
    delete(key) {
        const cacheKey = this._generateKey(key);
        this.cache.delete(cacheKey);
    }

    // 清空缓存
    clear() {
        this.cache.clear();
    }
}

module.exports = new Cache(); 