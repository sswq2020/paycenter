import Vue from 'vue'
import Router from 'vue-router'
const Review = () => import('@/views/finance/review')
const CashConfirm = () => import('@/views/finance/cashconfirm')
const TradeDetail = () => import('@/views/finance/tradedetail')
const AccountInfomanage = () => import('@/views/finance/accountinfomanage')
const AccountTradeDetails = () => import('@/views/finance/accountTradeDetails')


const Reimbursemanage = () => import('@/views/reimburse/index')
const AuditReimburse = () => import('@/views/reimburse/auditReimburse')


Vue.use(Router)

let globelRoutes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index')
    }
]

let commonRoutes = {
	path:'/main',
	name:'main',
	component:() => import(/* webpackChunkName: "about" */ '@/views/main/main'),
	children:[
        {
            path: '/home',
            name: 'home',
            component: () => import(/* webpackChunkName: "demo" */ '@/views/test/index'),
        },
        {
            path: '/personal',
            name: 'personal',
            component: () => import(/* webpackChunkName: "avatar" */ '@/views/personal/index'),
        },
        {
            path: '/web/settlementPayOrder/pageList/finance',
            name: 'review',
            component: Review
        },
        {
            path: '/web/settlementPayOrder/pageList/cashier',
            name: 'cashconfirm',
            component: CashConfirm
        },
        {
            path: '/web/settlementPayOrder/pageList/tradeDetail',
            name: 'tradedetail',
            component:TradeDetail
        },
        {
            path: '/web/bankAccount/pageList/hlet',
            name: 'accountinfomanage',
            component: AccountInfomanage
        },
        {
            path: '/finance/accountTradeDetails',
            name: 'accountTradeDetails',
            component: AccountTradeDetails
        },
        {
            path: '/web/expense/detail/pageSH',
            name: 'reimbursemanage',
            component: Reimbursemanage
        },
        {
            path: '/web/expense/detail/audit',
            name: 'auditReimburse',
            component: AuditReimburse
        },
    ]
}

export const router = new Router({
    routes: [
        ...globelRoutes,
        commonRoutes
    ]
})

//留取一份普通路由的name集合
let commonRoutesCluster = commonRoutes.children.map(target => target.name)
let globalRoutesCluster = globelRoutes.map(target => target.name)

router.beforeEach((to, from, next) => {
    if (commonRoutesCluster.includes(to.name) || globalRoutesCluster.includes(to.name)) {
        next()
    } else {
        next({name: 'home'})
    }
})
