import Vue from 'vue'
import Vuex from 'vuex'
import app from '@/store/app'
import reimburse from '@/store/reimburse'
import {review,tradedetail,cashconfirm,accountinfomanage,accountTradeDetails } from '@/store/finance'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        app,
        reimburse,
        review,
        tradedetail,
        cashconfirm,
        accountinfomanage,
        accountTradeDetails
    }
})
