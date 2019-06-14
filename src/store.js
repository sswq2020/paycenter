import Vue from 'vue'
import Vuex from 'vuex'
import {review,tradedetail,cashconfirm,accountinfomanage,accountTradeDetails } from '@/store/finance'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        review,
        tradedetail,
        cashconfirm,
        accountinfomanage,
        accountTradeDetails
    }
})
