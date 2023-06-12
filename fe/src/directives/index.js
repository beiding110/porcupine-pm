import auth from './auth.js';

export default {
    install: function(Vue){
        Vue.directive('auth', auth);
    }
};
