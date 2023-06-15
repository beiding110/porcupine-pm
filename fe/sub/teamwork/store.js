import Vue from "vue";

export default {
    state: {
        prolist: [],
    },
    getters: {
        projects(state) {
            return state.prolist;
        },
    },
    mutations: {
        setState: function(state, n){
            mixin(n, state, true);
        }
    },
    actions: {
        queryProjects({state}, cb) {
            if (state.prolist && state.prolist.length) {
                cb && cb(this.prolist);
            }

            Vue.prototype.$get('/project/list', data => {
                state.prolist = data;

                cb && cb(data);
            });
        },
    },
}
