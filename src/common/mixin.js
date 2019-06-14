import api from '@/api'
import { _toArray_ } from './util'
import DICT from '@/util/dict.js'
export const timerMixin = {
    data() {
        return {
            pickerOptions: {
                shortcuts: [
                    {
                        text: "最近一周",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "最近一个月",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "最近三个月",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit("pick", [start, end]);
                        }
                    }
                ]
            }
        }
    }
}

export const dayMixin = {
    data() {
        return {
            pickerOptions: {
                shortcuts: [
                    {
                        text: "最近一周",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit("pick", [start, end]);
                        }
                    }
                ]
            }
        }
    }
}

export const dictMixin = {
    data() {
        return {
            payOrderStatusList: [],
            appInfoList: [],
            bankDict: []
        }
    },
    methods: {
        async _getAppInfo() {
            const response = await api.getAppInfo()
            switch (response.code) {
                case DICT.SUCCESS:
                    this.appInfoList = _toArray_(response.data)
                    break;
                default:
                    break;
            }
        },
        async _getPayOrderStatus() {
            const response = await api.getPayOrderStatus()
            switch (response.code) {
                case DICT.SUCCESS:
                    this.payOrderStatusList = _toArray_(response.data)
                    break;
                default:
                    break;
            }
        },
        async _getbankDic() {
            const response = await api.getbankDic()
            switch (response.code) {
                case DICT.SUCCESS:
                    this.bankDict = _toArray_(response.data)
                    break;
                default:
                    break;
            }
        },
    },
    created() {
        this._getAppInfo()
        this._getPayOrderStatus()
        this._getbankDic()
    }
}

export const shrinkMixin = {
    data() {
        return {
            toggle: false
        }
    },
    computed: {
        toggleIcon() {
            return this.toggle ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
        }
    },
    methods: {
        toggleButton() {
            let vm = this;
            vm.toggle = !vm.toggle;
            setTimeout(() => {
                vm.$refs.tb.computedTableHeight()
            }, 500)
        }
    }

}