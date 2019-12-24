import Dict from '@/util/dict.js'

const store = {
    namespaced: true,
    state: {
        reimburseId:null, // 报销Id 默认跳出页面
        reimburseStatus:Dict.DRAFT // 报销状态 默认草稿跳出页面
    },
    mutations: {
        setReimburseId(state, payload) {
            state.reimburseId = payload
        },
        setReimburseStatus(state, payload) {
            state.reimburseStatus = payload
        },
        overrideStateProps(state, payload) {
            Object.keys(payload).forEach(key => {
                state[key] = payload[key];
            });
        },
        updateStateProps(state, payload) {
            const { name, value } = payload;
            if (typeof state[name] === "object" && Array.isArray(state[name]) !== true) {
                state[name] = { ...state[name], ...value };
            } else {
                state[name] = value;
            }
        },
    },
    actions: {
    }
}

export default store;