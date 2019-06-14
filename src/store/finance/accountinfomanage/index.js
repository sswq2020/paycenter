import api from '@/api'
import { Message } from 'element-ui';
import DICT from '@/util/dict.js'
const defaultlistParams = {
    shortName: "",
    accNo: "",
    page: 1,
    pageSize: 5
};

const defaultlistData = {
    list: [],
    paginator: {
        totalCount: 0
    }
}

const adapter = data => {
    let list = data.list.map((item) => {
        item.hideFinance = false
        return item
    })
    const rData = {
        ...data,
        list
    };
    return rData;
}

const defaultbankAccountParams = {
    accountId: null, // 银行账户ID
    shortName: null, // 银行账户简称
    accName: null, // 银行账户名称
    accNo: null, // 银行账号
    bankName: null, // 开户银行
    ubankNo: null, // 联行号 隐藏地不需要给用户知道
    branchName: null // 开户支行/分理处
}

const store = {
    namespaced: true,
    state: {
        isListDataLoading: false,
        isAccountLoading: false,
        bankInfoDetail: null,
        listParams: {
            ...defaultlistParams
        },
        bankAccountParams: {
            ...defaultbankAccountParams
        },
        accountdialog: false, // 弹窗显示隐藏
        isEdit: false, // false默认新增, true微新增
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
        setBankInfoDetail(state, payload) {
            state.bankInfoDetail = payload
        },
        setAccountdialog(state, payload) {
            state.accountdialog = payload
        },
        setListDataBalance(state,{balance,index}){
            const list = state.listData.list.slice();
            list[index].balance = balance;
            state.listData.list = list
        },
        setListDataHide(state,{hideFinance,index}){
            const list = state.listData.list.slice();
            list[index].hideFinance = hideFinance;
            state.listData.list = list
        }
    },
    actions: {
        async getListData({ commit, state }) {
            const { listParams } = state;
            commit("overrideStateProps", { isListDataLoading: true });
            const response = await api.bankAccountBalance(listParams);
            commit("overrideStateProps", { isListDataLoading: false });
            switch (response.code) {
                case DICT.SUCCESS:
                    commit("overrideStateProps", { listData: adapter(response.data) });
                    break;
                default:
                    Message.error(response.mesg);
                    break;
            }
        },
        async changePage({ dispatch, commit }, payload) {
            commit("updateStateProps", {
                name: "listParams",
                value: {
                    page: payload
                }
            });
            dispatch("getListData");
        },
        async changePageSize({ dispatch, commit }, payload) {
            // const { listParams } = state;
            commit("updateStateProps", {
                name: "listParams",
                value: {
                    pageSize: payload
                }
            });
            dispatch("getListData");
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
        async deleteBankAccount({ dispatch }, payload) {
            const response = await api.deleteBankAccount(payload);
            switch (response.code) {
                case DICT.SUCCESS:
                    Message.success(response.mesg);
                    break;
                default:
                    Message.error(response.mesg);
                    break;
            }
            dispatch("getListData");
        },
        async updateBankAccount({ dispatch,commit, state }, payload) {
            const SERVE = state.isEdit ? 'updateBankAccount' : 'createBankAccount'
            commit("overrideStateProps", { isAccountLoading: true });
            const response = await api[SERVE](payload);
            commit("overrideStateProps", { isAccountLoading: false });
            switch (response.code) {
                case DICT.SUCCESS:
                    commit("overrideStateProps", { accountdialog: false });
                    commit("overrideStateProps", { bankAccountParams: { ...defaultbankAccountParams } });
                    Message.success(response.mesg);
                    break;
                default:
                    Message.error(response.mesg);
                    break;
            }
            dispatch("getListData");
        },
        async refreshBalance({commit }, {id,index}) {
            const response = await api.refreshBalance({id});
            switch (response.code) {
                case DICT.SUCCESS:
                    commit("setListDataBalance",{balance:response.data.balance,index})
                    commit("setListDataHide",{hideFinance:true,index})
                    break;
                default:
                    Message.error(response.mesg);
                    break;
            }
        },
        // 打开新增弹窗
        openAddAccountDialog({ commit }) {
            commit("overrideStateProps", { isEdit: false });
            commit("overrideStateProps", {
                bankAccountParams: {
                    ...defaultbankAccountParams
                },
            });
            commit("overrideStateProps", { accountdialog: true });
        },
        // 打开编辑弹窗
        openEditAccountDialog({ commit }, payload) {
            commit("overrideStateProps", { isEdit: true });
            commit("overrideStateProps", {
                bankAccountParams: {
                    ...payload
                },
            });
            commit("overrideStateProps", { accountdialog: true });
        }
    }
}

export default store;