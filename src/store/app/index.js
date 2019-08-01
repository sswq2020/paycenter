import api from '@/api'
import { Message } from 'element-ui';
import DICT from '@/util/dict.js'

const store = {
    namespaced: true,
    state: {
        orderdetailVisible: false,  //订单弹窗是否可见
        orderdetailData: [] // 订单详细数据源
    },

    mutations: {
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
        }
    },
    actions: {
        async openOrderDetailDialog({ commit }, payload) {
            const response = await api.getOrderDesc(payload);
            switch (response.code) {
                case DICT.SUCCESS:
                    commit("overrideStateProps", { orderdetailData: response.data });
                    commit("overrideStateProps", { orderdetailVisible: true });
                    break;
                default:
                    Message.error(response.mesg);
                    break;
            }
        },
        closeOrderDetailDialog({ commit }) {
            commit("overrideStateProps", { orderdetailData: [] });
            commit("overrideStateProps", { orderdetailVisible: false });
        }
    }
}

export default store;