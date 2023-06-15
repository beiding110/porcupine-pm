import store from '@store';

/**
 * 检查用户是否有某权限
 * @param {String} key 权限name
 * @returns true/false
 */
export function hasAuth(key) {
    const map = store.state.userinfo.user.auth || [];

    return map.includes(key);
}

/**
 * 检查数组中的权限
 * @param {*} arr 待匹配的数组
 * @returns 处理后的新数组
 */
export function checkAuthInArr(arr = []) {
    return arr.filter(item => {
        if (item.auth) {
            return hasAuth(item.auth);
        }

        return true;
    });
}