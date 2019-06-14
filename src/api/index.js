import axios from 'axios'
import qs from 'qs'
import { Base64 } from '@/util/base64.js'
import { isMock } from "./mock";
var cookie = require('cookie-parse');

const env = process.env.NODE_ENV;

let baseURL = '/apis';//开发路由前缀
let loginUrl = '';

let redirectUrl = ''; //跳转到登录页的路由
let cookies = cookie.parse(document.cookie);
let Authorization = cookies.HLETTYPE +' '+cookies.HLETID
let uploadUrl = '/apis';
let validUrl = 'http://10.1.15.106:8102';

let financeURL = '';


// window.globelApi2 = 'http://10.1.15.106:8445'//test环境
// window.globelApi2 = 'http://192.168.4.16:25089'//建波
//  window.globelApi2 = 'http://192.168.4.16:25083'//冬菜

//根据不同的环境打包不同的接口
switch (env) {
    case 'development':
        baseURL = '/api';
        redirectUrl = 'http://localhost:8080/';
        loginUrl = 'http://localhost:3000/index.html';
        financeURL = 'payacc'
        break;
    case 'production':
        loginUrl = 'https://login.hletong.com/';
        redirectUrl = 'https://pay.hletong.com/';
        financeURL = 'payacc'
        break;
    case 'test':
        baseURL = 'http://10.1.15.106:8445';
        redirectUrl = 'http://cw.hlet.com';
        loginUrl = 'http://login.hlet.com';
        financeURL = 'payacc'
        break;
    default:
        break;

}

const goLogin = () => {
    if (env == 'development') {
        window.VueApp.$router.push({
            name: 'login'
        })
    } else {
        window.location.href = loginUrl + '?redirectUrl=' + redirectUrl;
    }
}


/*
* 首先判断localStorage是否有记录 by wzd
*
* */


let timeout = 300000;
let instance = axios.create({
    baseURL: baseURL,
    timeout: timeout
});

/*
*
* 请求的预处理 by wzd
* */
instance.interceptors.request.use((config) => {
    config.headers['Authorization'] = Authorization;
    config.headers['Accept'] = '';
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    return config;
}, (error) => {
    return Promise.reject(error);
});

/*
*
* 返回的预处理 by wzd
* */
instance.interceptors.response.use(function (response) {
    // Do something with response data
    return response.data;
}, function (error) {
    // console.log(error);
    let errCode = error.message.replace(/[^0-9]/gi, '');
    if (errCode == '401') {
        goLogin();
    }
    return Promise.reject(error);
});

const formDataRequest = (url, params, methods = 'post') => {
    let formData = new FormData();
    Object.keys(params).forEach(target => {
        if (typeof params[target] !== 'string') {
            formData.append(target, JSON.stringify(params[target]));
        } else {
            formData.append(target, params[target]);
        }
    })
    const mock = isMock({ url, params: formData, methods });
    if (env == 'development' && mock.isMock === true) {
        return new Promise((resolve) => {
            resolve(mock.mock);
        });
    }

    return new Promise((resolve, reject) => {
        instance({
            url: url,
            method: methods,
            data: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

/*
*
* 封装axios实例，对错误统一处理，返回成功的promise对象 by wzd
* */
const fetch = (url, params, methods = 'post') => {
    //对所有的请求进行页码的改动，新框架 by wzd
    if (params !== undefined && params.offset !== undefined && params.limit !== undefined) {
        params.offset = (params.offset - 1) * params.limit;
    }
    const mock = isMock({ url, params, methods });
    if (env == 'development' && mock.isMock === true) {
        return new Promise((resolve) => {
            resolve(mock.mock);
        });
    }
    return new Promise((resolve, reject) => {
        if (methods == 'get') {
            url = url + '?' + qs.stringify(params);
        }
        instance[methods](url, params).then(res => {
            switch (res.code) {
                case '-1':
                case '0000001':
                case '000002':
                case '010500':
                case '010002':
                case '020000':
                case '030001':
                    window.VueApp.$Message({
                        type: 'error',
                        message: res.mesg
                    })
                    break;
                case '040001':
                    goLogin();
                    break;
                default:
                    resolve(res)
                    break;
            }

        }).catch(err => {
            console.log(err);
            reject(err);
        })
    })
}
/*
*
* 封装axios实例，对错误统一处理，返回成功的promise对象
* */
const getfetch = (url, params, methods = 'post') => {
    //对所有的请求进行页码的改动，新框架 by wzd
    if (params !== undefined && params.offset !== undefined && params.limit !== undefined) {
        params.offset = (params.offset - 1) * params.limit;
    }
    return new Promise((resolve, reject) => {
        if (methods == 'get') {
            url = url + '?' + qs.stringify(params, { indices: false });
        }
        instance[methods](url, params).then(res => {
            switch (res.code) {
                case '-1':
                case '0000001':
                case '000002':
                case '010500':
                case '010002':
                case '020000':
                case '030001':
                    window.VueApp.$Message({
                        type: 'error',
                        message: res.mesg
                    })
                    break;
                case '040001':
                    goLogin();
                    break;
                default:
                    resolve(res)
                    break;
            }

        }).catch(err => {
            console.log(err)
            reject(err);
        })
    })
}

export default {
    /**
     *登陆接口
     * params:{
     *    username:string,
     *    password:string,
     *    grant_type:number,
     *    client_id:number,
     *    client_secret:number
     * }
     * 登陆也的数据后端不解析json数据，用formdata by  wzd
     * **/
    login(params) {
        let formData = new FormData();
        formData.append('username', params.username);
        formData.append('password', params.password);
        formData.append('grant_type', params.grant_type);
        // formData.append('client_id', params.client_id)
        // formData.append('client_secret', params.client_secret)
        Authorization = 'Basic ' + Base64.encode('hlet-system-center:123456');
        return new Promise((resolve, reject) => {
            instance({
                url: "/auth/oauth/token",
                method: 'post',
                data: formData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    'Authorization':Authorization
                }
            }).then(res => {
                /*
                * 变量保存token，减少每次访问localstorage的消耗
                * */
                var cookie = 'HLETID='+res.value+';path=/;domain=hletong.com'
                var cookie2 = 'HLETTYPE='+res.tokenType+';path=/;domain=hletong.com'
                document.cookie = cookie
                document.cookie = cookie2
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        })
    },
    goLogin() {
        goLogin();
    },
    /*
        * 获取用户信息
        * by  wulei
        * */
    getUser() {
        return fetch('/system/manage/user/getUser', {}, 'get')
    },
    /*
        * 获取系统和菜单权限
        * by  wulei
    */
    getPermissions(sid) {
        return fetch('/system/manage/user/getPermissions', { sid: sid }, 'get')
    },
    /*
        * 获取系统
        * by  wulei
    */
    getSystems() {
        return fetch('/system/manage/user/getSystems', '', 'get')
    },
    // 文件上传
    upload(params) {
        // return fetch(`${uploadUrl}/dfs/open/files/upload`, params)
        return fetch(`/dfs/open/files/upload`, params)
    },
    // 修改头像
    resetAvatar(params) {
        return formDataRequest('/system/manage/user/resetAvatar', params)
    },
    // 修改密码
    resetPwd(params) {
        return formDataRequest('/system/manage/user/resetPwd', params)
    },
    // 获取验证码
    getVerfyCode(params) {
        // return formDataRequest(`${validUrl}/mc-client/sms/template/smsService/sendVerifiCode`, params)
        return formDataRequest(`/mc-client/sms/template/smsService/sendVerifiCode`, params)
    },
    // 校验验证码
    reseverifiCodetPwd(params) {
        // return formDataRequest(`${validUrl}/mc-client/sms/template/smsService/verifiCode`, params)
        return formDataRequest(`/mc-client/sms/template/smsService/verifiCode`, params)
    },
    // #region  财务中心
    /**
     * @author sswq
     * @param params
     * @description 银行转账财务审核列表
     * */
    getReviewList(params) {
        return fetch(financeURL + '/web/settlementPayOrder/pageList/finance', params)
    },
    /**
     * @author sswq
     * @param params
     * @description 银行转账批量审核或者作废
     * */
    batchAudit(params) {
        return fetch(financeURL + '/web/settlementPayOrder/audit/finance', params)
    },
    /**
     * @author sswq
     * @param params
     * @description 银行转账出纳确认列表
     * */
    getCashList(params) {
        return fetch(financeURL + '/web/settlementPayOrder/pageList/cashier', params)
    },
    /**
     * @author sswq
     * @param params
     * @description 出纳批量转账或者作废
     * */
    batchCash(params) {
        return fetch(financeURL + '/web/settlementPayOrder/audit/cashier', params)
    },
    /**
     * @author sswq
     * @param params
     * @description 出纳批量重新支付
     * */
    rePay(params) {
        return fetch(financeURL + '/web/settlementPayOrder/operate/rePay', params,'get')
    },
    /**
     * @author sswq
     * @description 刷新状态
     * */
    refreshStatus(params) {
        return fetch(financeURL + '/web/settlementPayOrder/operate/refreshStatus', params, 'get')
    },
    /**
     * @author sswq
     * @description 人工确认
     * */
    cashierConfirm(params) {
        return fetch(financeURL + '/web/settlementPayOrder/operate/cashier', params)
    },
    /**
     * @author sswq
     * @description 银行账户信息管理列表的接口---也是查询公司余额账户(第一次显示账户余额)
     * */
    bankAccountBalance(params) {
        return fetch(financeURL + '/web/bankAccount/pageList/hlet', params, 'get')
    },
    /**
     * @author sswq
     * @param params
     * @description 银行交易明细列表
     * */
    tradeDetail(params) {
        return fetch(financeURL + '/web/settlementPayOrder/pageList/tradeDetail', params)
    },
    /**
     * @author sswq
     * @param params
     * @description 手动数据同步
     * */
    manualSync(params) {
        return fetch(financeURL + '/web/settlementPayOrder/notifyCallback', params,'get')
    },
    /**
     * @author sswq
     * @param params id 账户信息id
     * @description 删除账户信息
     * */
    deleteBankAccount(params) {
        return fetch(financeURL + '/web/bankAccount/delete', params, 'get')
    },
    /**
     * @author sswq
     * @param params
     * @description 新增账户信息
     * */
    createBankAccount(params) {
        return fetch(financeURL + '/web/bankAccount/create', params)
    },
    /**
     * @author sswq
     * @param params 比新增多一个accountId 账户ID
     * @description 编辑账户信息
     * */
    updateBankAccount(params) {
        return fetch(financeURL + '/web/bankAccount/update', params)
    },
    /**
     * @author sswq
     * @param params
     * @description 银行卡片点击眼睛再次查询账户余额
     * */
    refreshBalance(params) {
        return fetch(financeURL + '/web/bankAccount/refreshBalance', params, 'get')
    },
    /**
     * @author sswq
     * @param params
     * @description 获取交易明细
     * */
    getBillDetail(params) {
        return fetch(financeURL + '/web/billDetail/getBillDetail', params)
    },
    // #endregion

    // #region  字典项
    /**
     * @author sswq
     * @description 数据来源
     * */
    getAppInfo() {
        return fetch(financeURL + '/web/systemData/appInfo', '', 'get')
    },
    /**
     * @author sswq
     * @description 支付结算订单状态
     * */
    getPayOrderStatus() {
        return fetch(financeURL + '/web/systemData/settlementPayOrderStatus', '', 'get')
    },
    /**
     * @author sswq
     * @description 银行字典
     * */
    getbankDic() {
        return fetch(financeURL + '/web/systemData/bankDic', '', 'get')
    }
    // #endregion
}
