import api from '@/api'
import { Message } from 'element-ui';
import DICT from '@/util/dict.js'
import { downloadExcel, deleteProps } from '@/util/util.js'
import { requestParamsByTimeRange, requestParamsByStatus } from '@/common/util.js'
import _ from 'lodash'
import moment from 'moment'
const defaultlistParams = {
    creditNo: '', // 交易凭证号
    settlementNo: '', // 业务单号
    payerBankName: '', // 转出账户名
    payeeBankNo: '', // 转入账户号
    appCode: '', //数据来源
    status: [], //状态
    timeRange: '', // 时间范围
    page: 1,
    pageSize: 10,
};

const defaultlistData = {
    list: [],
    paginator: {
        totalCount: 0
    }
}

/**只是请求参数的key,页面中的观察属性却不需要，只在请求的那一刻由timeRange赋值*/
const EXTRA_PARAMS_KEYS = ['startTime', 'endTime'];

/**比较listParams是否和原来的listParams是否发生变化*/
const diff = (a, b) => {
    const keys = Object.keys(a);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        if (key == 'pageSize' || key == 'page') {
            continue;
        } else {
            if (!(_.isEqual(a[key], b[key]))) {
                return true
            }
        }
    }
    return false
}

const store = {
    namespaced: true,
    state: {
        isListDataLoading: false,
        isBalanceDataLoading: false,    // 查询余额loading
        isSyncDataLoading: false, // 手动数据同步loading
        isDownExcelLoading: false, // 下载的loading
        listParams: {
            ...defaultlistParams
        },
        diffListParams: _.cloneDeep(defaultlistParams),
        listData: {
            ...defaultlistData
        },
        balanceList: []
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
        async getListDataBylistParams({ dispatch, commit, state }) {
            const flag = diff(state.listParams, state.diffListParams);
            if (flag) {
                commit("updateStateProps", {
                    name: "listParams",
                    value: {
                        pageSize: 10
                    }
                });
                commit("updateStateProps", {
                    name: "listParams",
                    value: {
                        page: 1
                    }
                });
            }
            dispatch("getListData");
        },
        async getListData({ commit, state }) {
            const { listParams } = state;
            const { timeRange, status } = listParams;
            const _reqParams_ = requestParamsByTimeRange(listParams, timeRange, ...EXTRA_PARAMS_KEYS)
            const reqParams = requestParamsByStatus(_reqParams_, status)
            commit("overrideStateProps", { isListDataLoading: true });
            const response = await api.tradeDetail(reqParams);
            commit("overrideStateProps", { isListDataLoading: false });
            switch (response.code) {
                case DICT.SUCCESS:
                    commit("overrideStateProps", { listData: response.data });
                    break;
                default:
                    commit("overrideStateProps", { listData: { ...defaultlistData } });
                    Message.error(response.mesg);
                    break;
            }
            commit("overrideStateProps", { diffListParams: _.cloneDeep(state.listParams) });
        },
        async changePage({ dispatch, commit }, payload) {
            commit("updateStateProps", {
                name: "listParams",
                value: {
                    page: payload
                }
            });
            dispatch("getListDataBylistParams");
        },
        async changePageSize({ dispatch, commit }, payload) {
            commit("updateStateProps", {
                name: "listParams",
                value: {
                    pageSize: payload
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
            dispatch("getListData");
        },
        async getBalanceData({ commit }) {
            commit("overrideStateProps", { isBalanceDataLoading: true });
            const response = await api.bankAccountBalance();
            commit("overrideStateProps", { isBalanceDataLoading: false });
            switch (response.code) {
                case DICT.SUCCESS:
                    commit("overrideStateProps", { balanceList: response.data.list });
                    break;
                default:
                    Message.error(response.mesg);
                    break;
            }
        },
        async manualSync({ commit }) {
            commit("overrideStateProps", { isSyncDataLoading: true });
            const response = await api.manualSync();
            commit("overrideStateProps", { isSyncDataLoading: false });
            switch (response.code) {
                case DICT.SUCCESS:
                    Message.success("手动数据同步成功,请重新查询！");
                    break;
                default:
                    Message.error(response.mesg);
                    break;
            }
        },
        async download({ commit, state }) {
            const { listParams } = state;
            const { timeRange, status } = listParams;
            const _reqParams_ = requestParamsByTimeRange(listParams, timeRange, ...EXTRA_PARAMS_KEYS)
            let reqParams = requestParamsByStatus(_reqParams_, status)
            // 去掉页数的参数
            reqParams = deleteProps(reqParams, 'page', 'pageSize')
            commit("overrideStateProps", { isDownExcelLoading: true });
            const response = await api.tradeDetailED(reqParams);
            commit("overrideStateProps", { isDownExcelLoading: false });
            downloadExcel(response, `${moment().format("YYYY年MM月DD日 HH时mm分ss秒")}筛选的历史或已完成结算订单报表`)
        },
    }
}

export default store;