import api from '@/api'
import { Message } from 'element-ui';
import DICT from '@/util/dict.js'
import { requestParamsByTimeRange,requestParamsByStatus, Message_fail, failHtml } from '@/common/util.js'
import _ from 'lodash'
const defaultlistParams = {
    settlementNo: '', // 业务单号
    payerBankName: '', // 转出账户名
    payeeAccountName: '', // 转入账户名
    payeeBankNo: '', // 转入账户号
    appCode: '', //数据来源
    status: ["2"], //状态
    timeRange: [], // 时间范围
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
        /***批量操作的那些弹窗可见性**/
        batchAuditVisible: false,
        batchDeleteVisible: false,

        isListDataLoading: false,
        isbatchAuditLoading: false, // 批量审核loading
        isbatchDeleteLoading: false,// 批量废除loading
        auditInstances: [], // 审核详情具体内容
        listParams: {
            ...defaultlistParams
        },
        diffListParams: _.cloneDeep(defaultlistParams),
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
        setAuditInstances(state, payload) {
            state.auditInstances = payload
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
            const { timeRange,status } = listParams;
            const _reqParams_ = requestParamsByTimeRange(listParams, timeRange, ...EXTRA_PARAMS_KEYS)
            const reqParams = requestParamsByStatus(_reqParams_,status)
            commit("overrideStateProps", { isListDataLoading: true });
            const response = await api.getReviewList(reqParams);
            commit("overrideStateProps", { isListDataLoading: false });
            switch (response.code) {
                case DICT.SUCCESS:
                    commit("overrideStateProps", { listData: response.data });
                    break;
                default:
                    commit("overrideStateProps", {listData: {...defaultlistData}});
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
        async batchAudit({ dispatch, commit }, payload) {
            const { auditResult } = payload
            if (auditResult === 0) {
                commit("overrideStateProps", { isbatchDeleteLoading: true });
            } else {
                commit("overrideStateProps", { isbatchAuditLoading: true });
            }
            const response = await api.batchAudit(payload);
            if (auditResult === 0) {
                commit("overrideStateProps", { isbatchDeleteLoading: false });
                commit("overrideStateProps", { batchDeleteVisible: false });
            } else {
                commit("overrideStateProps", { isbatchAuditLoading: false });
                commit("overrideStateProps", { batchAuditVisible: false });
            }
            switch (response.code) {
                case DICT.SUCCESS:
                    Message.success(response.mesg);
                    break;
                default:
                    Message_fail(failHtml, response.data.failMap)
                    break;
            }
            dispatch("getListData");
        }
    }
}

export default store;