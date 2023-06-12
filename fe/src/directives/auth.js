import {hasAuth} from '@/js/authority';

function removeEl(el) {
    try {
        el.parentNode && el.parentNode.removeChild(el);
    } catch (e) {
        // e
    }
}

export default {
    //指令第一次绑定到元素时
    bind: (el, {value}) => {
        el.style.display = 'none';
        
        if (!hasAuth(value)) {
            removeEl(el);
        } else {
            el.style.display = '';
        }
    },
    //被绑定元素插入父节点时
    inserted: (el, {value}) => {
        if (!hasAuth(value)) {
            removeEl(el);
        }
    },
    update: (el, {value}) => {
        if (!hasAuth(value)) {
            removeEl(el);
        }
    },
};
