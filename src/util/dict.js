const DICT = {};
/** 成功 */
DICT.SUCCESS = '000000';
/** 导入 */
DICT.IMPORT = '10000';
/** 集配平台 */
DICT.JPPT_PLANT = '10010';
/** 电商平台 */
DICT.BUSINESS_ONLINE_PLANT = '10020';


DICT.APP_INFO = {
    [DICT.IMPORT]:'导入',
    [DICT.JPPT_PLANT]:'集配平台',
    [DICT.BUSINESS_ONLINE_PLANT]:'电商平台'
}

DICT.NOTIFY_STATUS  = {
    "0":'失败',
    "1":'成功',
    "2":'同步中',
    "-1": "全部"
}

DICT.PAY_STATUS = {
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

export default DICT;