import pathToRegexp from "path-to-regexp";
import mockjs from "mockjs";

const hostList = {
    default: ""
};

const IS_MOCK = true

const dict = { 'SUCCESS': "000000" }

const body = {
    "code": dict.SUCCESS,
    "mesg": "处理成功",
    "timestamp": new Date().getTime(),
    "data": {},

}

const body_fail = {
    "code": "HL070002000",
    "data": {
        "failMap": {
            "key1": "系统错误1",
            "key2": "系统错误2",
            "key3": "系统错误3",
            "key4": "系统错误4",
        },
        successList: [],
    },
    "mesg": "系统错误"
}



const StatusList = {
    "1": "转账成功",
    "2": "财务待审核",
    "3": "财务审核不通过",
    "4": "出纳待审核",
    "5": "出纳审核不通过",
    "6": "转帐中",
    "7": "转帐状态未知",
    "8": "转帐失败",
    "9": "异常或其他",
    "10": "财务审核中",
    "11": "出纳审核中",
    "12": "待支付",
    "13": "银行请求失败",
    "14": "待确认"
}



const roleList = {
    createdBy: "system",
    createdTime: '@DATE("yyyy-MM-dd HH:mm:ss")',
    roleCode: "role_hlet-system-center",
    roleDesc: "@NAME()",
    'roleId|+1': "13724569",
    roleName: "@NAME()",
    status: '@PICK(0, 1)',
    systemCode: "hlet-system-center",
    'systemId||+1': "13724",
    systemName: "系统中心",
    updatedBy: "admin",
    updatedTime: '@DATE("yyyy-MM-dd HH:mm:ss")',
};

const reviewList = {
    "id|+1": "65756713724569",
    "settlementNo": "CYJY@INTEGER(2019690000,2019690999)", //业务单号
    "fund": "@PICK('盖蓬费', '超损费','车船运费')", // 款项
    "amount": "@float(200,999)", // 金额(元)
    "appCode": "@PICK(1,0)", // 数据来源
    "appName": "集配货运", // 数据来源 名称
    "payerAccountName": "惠龙易通@CITY()公司", // 转出账户名
    "payerBankNo": "65521464564654987654", // 转出账户号
    "payeeAccountName": "@CNAME()", // 转入账户名 
    "payeeBankNo": "65521464564654987654", // 转入账户号
    "payeeOpenDept": "@PICK('中国','中信')银行", // 转入账户开户机构名称
    "status": "@PICK(2,3)", // 状态 int
    "createdTime": "@DATE('yyyy-MM-dd HH:mm:ss')",
    "returnMsg": '@CTITLE(5,10)',
    "callbackStatus":"@PICK(0,1,2)",
    "callbackResult":"执行请求失败 返回信息为==回调发生异常 异常信息为[Connect to 127.0.0.1:8080 [/127.0.0.1] failed: Connection refused (Connection refused)]执行请求失败 返回信息为==回调发生异常 异常信息为[Connect to 127.0.0.1:8080 [/127.0.0.1] failed: Connection refused (Connection refused)]执行请求失败 返回信息为",
    "auditInstances": [{     // 审核信息,包含审核人,备注,审核时间,审核结果
        auditorName: "@CNAME()",
        auditTime: '@DATE("yyyy-MM-dd HH:mm:ss")',
        auditOpinion: '@CTITLE(2,10)', // 备注意见
        auditResult: "@PICK(4,5,6,7)", // 审核结果',
    }]
}

const cashconfirmList = {
    "creditNo": "JS@INTEGER(2019690000,2019690999)", //交易凭证号
    "id|+1": "65756713724569",
    "settlementNo": "JS@INTEGER(2019690000,2019690999)", //业务单号
    "fund": "@PICK('盖蓬费', '超损费','车船运费')", // 款项
    "amount": "@float(200,999)", // 金额(元)
    "appCode": "@PICK('10000','10010','10020')", // 数据来源
    "appName": "集配货运", // 数据来源 名称
    "payerAccountName": "惠龙易通@CITY()公司", // 转出账户名
    "payerBankNo": "65521464564654987654", // 转出账户号
    "payeeAccountName": "@CNAME()", // 转入账户名 
    "payeeBankNo": "65521464564654987654", // 转入账户号
    "payeeOpenDept": "@PICK('中国','中信')银行", // 转入账户开户机构名称
    "status": "@PICK(4,5,6,7,11,12,13)", // 状态 int
    "createdTime": "@DATE('yyyy-MM-dd HH:mm:ss')",
    "cashier": "@CNAME()", // 转账人
    "payTime": '@DATE("yyyy-MM-dd HH:mm:ss")', // 转账时间
    "auditInstances|1-3": [{     // 审核信息,包含审核人,备注,审核时间
        auditorName: "@CNAME()", //审核人
        auditTime: '@DATE("yyyy-MM-dd HH:mm:ss")', // 审核时间
        auditOpinion: '@CTITLE(2,10)', // 备注意见
        auditResult: "@PICK(0,1)", // 审核结果',
    }]
}

const tradeDetailList = {
    ...reviewList, ...{
        "status": "@PICK(1,8)",
        "creditNo": "JS@INTEGER(2019690000,2019690999)"
    }
}


const bankAccountList = {
    "accountId|+1": "65756713724569", // 账户ID
    shortName: "惠龙账户@PICK(4,5,6,7)", // 账户简称
    accNo: "65521464564654987654", // 账号
    accName: "惠龙易通国际物流股份有限公司涟水分公司", // 账户名称
    openaccDept: "@PICK('中国','中信','建设')银行", // 开户机构名称
    accStatus: "@PICK('0','1','2','4')", // 账户状态
    balance: "@INTEGER(2019690000,2019690999)", // 余额 非公司账号无法查询
    balancedate: '@DATE("yyyy-MM-dd HH:mm:ss")', // 余额查询日期
    bankName: "中国建设银行", // 银行名称
    ubankNo: "10000", // 联行号
    branchName: "润州支行" // 分行名称
}

const detailList = {
    "id|+1": "65756713724569",
    tranTime: '@DATE("yyyy-MM-dd HH:mm:ss")', // 交易时间
    dorc: "@PICK('0','1')",//交易类型 0 借 1贷
    creditNo: "pz@INTEGER(2019690000,2019690999)",//凭证号
    accName1: "@CNAME",// 对方账户名称
    accNo1: "65@INTEGER(2019690000,2019690999)",// 对方账号
    abstractData: "@CTITLE(6)",// 摘要
    amount: "-@INTEGER(90000,2019690999)",// 发生金额
    balance: "@INTEGER(90000,2019690999)",// 余额
}

const mockRouterMap = {
    [hostList.default]: [
        // #region  查询公司账户所有信息
        {
            isMock: IS_MOCK,
            methods: 'get',
            router: 'payacc/web/bankAccount/all/hlet',
            result() {
                return {
                    ...body,
                    "data": {
                        "162865482049781760": {
                            "accName": "惠龙易通国际物流股份有限公司涟水分公司",
                            "accNo": "32050172763600001605",
                            "accountId": "162865482049781760",
                            "bankName": "建设银行",
                            "branchName": "建设银行",
                            "createdBy": "system",
                            "createdTime": "2019-05-23 08:22:14.0",
                            "shortName": "涟水1605",
                            "ubankNo": "105100000017",
                            "updatedBy": "system",
                            "updatedTime": "2019-05-23 10:07:39.0",
                            "version": "1"
                        },
                    },
                };
            }
        },
        // #endregion 

        // #region  银行转账财务审核列表
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: 'payacc/web/settlementPayOrder/pageList/finance',
            result(params) {
                return {
                    ...body,
                    ...{
                        data: {
                            'list|1-10': [reviewList],
                            "paginator": {
                                "currentPage": params.page,
                                "pageSize": params.pageSize,
                                "totalCount": 1000,
                                "totalPage": 1000 / params.pageSize
                            },
                            pageTotalAmount: 45567453.23,
                            countTotalAmount: 192567453.23
                        },
                    },
                };
            }
        },
        // #endregion 

        // #region  银行转账批量审核或者作废
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: 'payacc/web/settlementPayOrder/audit/finance',
            result(params) {
                return Math.random() > 0.5 ? body : body_fail
            }
        },
        // #endregion 

        // #region  银行转账出纳确认列表
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: 'payacc/web/settlementPayOrder/pageList/cashier',
            result(params) {
                return {
                    ...body,
                    ...{
                        data: {
                            'list|20-30': [cashconfirmList],
                            "paginator": {
                                "currentPage": params.page,
                                "pageSize": params.pageSize,
                                "totalCount": 1000,
                                "totalPage": 1000 / params.pageSize
                            },
                            pageTotalAmount: 45567453.23,
                            countTotalAmount: 192567453.23
                        },
                    },
                };
            }
        },
        // #endregion 

        // #region  出纳批量转账或者作废
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: 'payacc/web/settlementPayOrder/audit/cashier',
            result(params) {
                return Math.random() > 0.5 ? body : body_fail
            }
        },
        // #endregion         

        // #region  刷新状态
        {
            isMock: IS_MOCK,
            methods: 'get',
            router: 'payacc/web/settlementPayOrder/operate/refreshStatus',
            result(params) {
                return Math.random() > 0.5 ? body : body_fail
            }
        },
        // #endregion 

        // #region  重新支付
        {
            isMock: IS_MOCK,
            methods: 'get',
            router: 'payacc/web/settlementPayOrder/operate/rePay',
            result() {
                return Math.random() > 0.5 ? body : body_fail
            }
        },
        // #endregion 

        // #region  人工确认
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: 'payacc/web/settlementPayOrder/operate/cashier',
            result(params) {
                return {
                    ...body,
                };
            }
        },
        // #endregion    

        // #region  银行转账交易明细列表(历史或者已完成结算订单查询)
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: 'payacc/web/settlementPayOrder/pageList/tradeDetail',
            result(params) {
                return {
                    ...body,
                    ...{
                        data: {
                            'list|1-10': [tradeDetailList],
                            "paginator": {
                                "currentPage": params.page,
                                "pageSize": params.pageSize,
                                "totalCount": 1000,
                                "totalPage": 1000 / params.pageSize
                            },
                            pageTotalAmount: 45567453.23,
                            countTotalAmount: 192567453.23
                        },
                    },
                };
            }
        },
        // #endregion 

        // #region  重新转账
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: 'payacc/web/settlementPayOrder/audit/againTransfer',
            result(params) {
                return {
                    ...body,
                };
            }
        },
        // #endregion   

        // #region  银行账户信息管理列表也是账户余额接口
        {
            isMock: IS_MOCK,
            methods: 'get',
            router: 'payacc/web/bankAccount/pageList/hlet',
            result(params) {
                return {
                    ...body,
                    ...{
                        data: {
                            'list|6-15': [bankAccountList],
                            "paginator": {
                                "currentPage": params.page,
                                "pageSize": params.pageSize,
                                "totalCount": 1000,
                                "totalPage": 1000 / params.pageSize
                            },
                        },
                    },
                };
            }
        },
        // #endregion 

        // #region  银行卡片点击眼睛再次查询账户余额
        {
            isMock: IS_MOCK,
            methods: 'get',
            router: 'payacc/web/bankAccount/refreshBalance',
            result(params) {
                return {
                    ...body,
                    data: {
                        balance: 854654324
                    }
                };
            }
        },
        // #endregion 


        // #region  删除账户信息
        {
            isMock: IS_MOCK,
            methods: 'get',
            router: 'payacc/web/bankAccount/delete',
            result(params) {
                return {
                    ...body,
                };
            }
        },
        // #endregion  

        // #region  新增账户信息
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: 'payacc/web/bankAccount/create',
            result(params) {
                return {
                    ...body,
                };
            }
        },
        // #endregion  

        // #region  编辑账户信息
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: 'payacc/web/bankAccount/update',
            result(params) {
                return {
                    ...body,
                };
            }
        },
        // #endregion  

        // #region  获取交易明细
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: 'payacc/web/billDetail/getBillDetail',
            result(params) {
                return {
                    ...body,
                    ...{
                        data: {
                            'list|6-15': [detailList],
                            "paginator": {
                                "totalPage": 5
                            },
                            reserveData: {}
                        },
                    },
                };
            }
        },
        // #endregion  


        // #region  字典项
        {
            isMock: IS_MOCK,
            methods: 'get',
            router: 'payacc/web/systemData/appInfo',
            result() {
                return {
                    ...body,
                    data: {
                        "10000": "导入",
                        "10010": "集配平台",
                        "10020": "电商平台",
                    }
                };
            }
        },
        {
            isMock: IS_MOCK,
            methods: 'get',
            router: 'payacc/web/systemData/settlementPayOrderStatus',
            result() {
                return {
                    ...body,
                    data: StatusList
                };
            }
        },
        {
            isMock: IS_MOCK,
            methods: 'get',
            router: 'payacc/web/systemData/bankDic',
            result() {
                return {
                    ...body,
                    data: {
                        "10000": "中国建设银行",
                        "10010": "中国农业银行",
                        "10020": "交通银行",
                    }
                };
            }
        },


        // #endregion                 
    ]
};

export const isMock = ({ url, methods, params = {}, host = "", version = "" }) => {
    let hasMock = {
        isMock: false
    };
    const path = version !== "" ? `/${version}url` : url;
    if (mockRouterMap[host] !== undefined) {
        mockRouterMap[host].forEach(routerObject => {
            if (routerObject.methods.toUpperCase() === methods.toUpperCase() && routerObject.isMock === true) {
                if (pathToRegexp(routerObject.router).exec(path) !== null) {
                    hasMock = { ...routerObject };
                    hasMock.mock = mockjs.mock(routerObject.result(params));
                }
            }
        });
    }
    return hasMock;
};