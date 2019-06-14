import api from '@/api'
import { Message } from 'element-ui';
import DICT from '@/util/dict.js'
import {requestParamsByTimeRange} from '@/common/util.js'
import _ from 'lodash'

const time = new Date();
const year = time.getFullYear();
const month = time.getMonth();
const day = time.getDate();
const START = new Date(year,month,day);
const END= new Date(year,month,day);
const defaultlistParams = {
    timeRange: [START,END], // 时间范围
    startpage: 1, // 启示页次
    poststr:null, // 查询定位串(252)
};

const defaultlistData = {
    list: [],
    paginator: {
        totalCount: 0
    }
}

/**只是请求参数的key,页面中的观察属性却不需要，只在请求的那一刻由timeRange赋值*/
const EXTRA_PARAMS_KEYS = ['startDate','endDate'];

/**比较listParams是否和原来的listParams是否发生变化*/
const diff = (a, b) => {
    const keys = Object.keys(a);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        if (key == 'startpage' || key == 'poststr') {
            continue;
        } else {
            if(!(_.isEqual(a[key],b[key]))){
                return true
            }
        }
    }
    return false
}
const store = {
    namespaced: true,
    state: {
        /******账户交易具体模块***** */
        isListDataLoading:false,
        listParams:{
            ...defaultlistParams
        },
        diffListParams: _.cloneDeep(defaultlistParams),
        bankAccountInfoDetail:null,
        listData: {
            ...defaultlistData
        }
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
        },
        setBankAccountInfoDetail(state, payload) {
            state.bankAccountInfoDetail = payload
        },
    },
    actions: {
        async getListDataBylistParams({dispatch,commit,state}){
            const flag = diff(state.listParams, state.diffListParams);
            if(flag){
                commit("updateStateProps", {
                    name: "listParams",
                    value: {
                        startpage: 1
                    }
                });
                commit("updateStateProps", {
                    name: "listParams",
                    value: {
                        poststr: null
                    }
                });
            }
            dispatch("getListData");
        },
        // 交易明细请求接口
        async getListData({ commit, state }) {
            const { listParams,bankAccountInfoDetail } = state;
            const { timeRange } = listParams;
            const reqParams = requestParamsByTimeRange(listParams,timeRange,...EXTRA_PARAMS_KEYS);
            const params = {...reqParams,...bankAccountInfoDetail}
            commit("overrideStateProps", { diffListParams: _.cloneDeep(state.listParams) });
            commit("overrideStateProps", { isListDataLoading: true });
            const response = await api.getBillDetail(params);
            commit("overrideStateProps", { isListDataLoading: false });
            switch (response.code) {
                case DICT.SUCCESS:
                    commit("overrideStateProps", { listData: response.data });
                    commit("updateStateProps", {
                        name: "listParams",
                        value: {
                            poststr: response.data.reserveDate
                        }
                    });
                    break;
                default:
                    commit("overrideStateProps", {listData: {...defaultlistData}});
                    Message.error(response.mesg);
                    break;
            }
        },
        async changePage({ dispatch, commit }, payload) {
            commit("updateStateProps", {
                name: "listParams",
                value: {
                    startpage: payload
                }
            });
            dispatch("getListDataBylistParams");
        },
        async clearListParams({ dispatch, commit }) {
            commit("overrideStateProps", {
                listParams: {
                    ...defaultlistParams
                }
            });
            commit("overrideStateProps", {
                listData: {
                    ...defaultlistData
                }
            });
            dispatch("getListDataBylistParams");
        },

    }
}

export default store;