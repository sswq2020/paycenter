<template>
  <div class="container single-page">
    <HletongBreadcrumb :data="breadTitle">
      <el-button 
        class="text-btn"
        plain 
        type="primary" 
        size="small"
        v-if="batchexport"
        :loading="isDownExcelLoading"
        @click="download" 
        icon="el-icon-download">批量导出</el-button>
      <el-button
        class="text-btn"
        plain 
        type="primary"
        size="small"
        v-if="datasync"
        :loading="isSyncDataLoading"
        @click="manualSync"
        icon="el-icon-refresh"
      >手动数据同步</el-button>
    </HletongBreadcrumb>
    <div class="banner-wrap">
      <showbanner>
        <div class="colum">预计支出(元):</div>
        <div class="colum">
          <div class="cashpay">￥{{$numFormatter(listData.pageTotalAmount)}}</div>
          <div class>单页总计</div>
        </div>
        <div class="colum">
          <div class="cashpay">￥{{$numFormatter(listData.countTotalAmount)}}</div>
          <div class>总计</div>
        </div>
      </showbanner>
    </div>    
    <div class="search-box">
      <div class="form-item">
        <label>业务单号</label>
        <div class="form-control">
          <el-input v-model="listParams.settlementNo" placeholder="请输入" size="small"></el-input>
        </div>
      </div>
      <div class="form-item">
        <label>数据来源</label>
        <div class="form-control">
          <el-select v-model="listParams.appCode" placeholder="请选择" size="small">
            <el-option
              v-for="item in appInfoList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="form-item">
        <label>状态</label>
        <div class="form-control">
          <el-select  multiple collapse-tags v-model="listParams.status" placeholder="请选择" size="small">
            <el-option
              v-for="item in filterOrderStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="form-item">
        <label>支付时间</label>
        <div class="form-control">
          <el-date-picker
            v-model="listParams.timeRange"
            type="datetimerange"
            size="small"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          ></el-date-picker>
        </div>
      </div>
      <el-collapse-transition>
        <div class="form-item" v-show="toggle">
          <label>同步状态</label>
          <div class="form-control">
            <el-select v-model="listParams.notifyStatus" placeholder="回调同步状态" size="small">
            <el-option
              v-for="item in notifyStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          </div>
        </div>
      </el-collapse-transition>      
      <el-collapse-transition>
        <div class="form-item" v-show="toggle">
          <label>转出账户名</label>
          <div class="form-control">
            <el-select v-model="listParams.payerAccountId" placeholder="请选择转出账户名" size="small">
            <el-option
              v-for="item in accountList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          </div>
        </div>
      </el-collapse-transition>
      <el-collapse-transition>
        <div class="form-item" v-show="toggle">
          <label>转入账户号</label>
          <div class="form-control">
            <el-input v-model="listParams.payeeBankNo" placeholder="请输入" size="small"></el-input>
          </div>
        </div>
      </el-collapse-transition>
      <el-collapse-transition>
        <div class="form-item" v-show="toggle">
          <label>转入账户名</label>
          <div class="form-control">
            <el-input v-model="listParams.payeeAccountName" placeholder="请输入" size="small"></el-input>
          </div>
        </div>
      </el-collapse-transition>
      <el-collapse-transition>
        <div class="form-item" v-show="toggle">
          <label>交易凭证号</label>
          <div class="form-control">
            <el-input v-model="listParams.creditNo" placeholder="请输入" size="small"></el-input>
          </div>
        </div>
      </el-collapse-transition>
      <div class="form-item" style="margin-right:0px">
        <el-button
          size="small"
          round
          :icon="toggleIcon"
          @click="toggleButton"
        >{{toggle ? '收缩' : '展开'}}</el-button>
      </div>
      <div class="form-item">
        <el-button
          type="primary"
          :loading="isListDataLoading"
          @click="getListDataBylistParams"
          size="small"
        >查询</el-button>
        <el-button size="small" @click="clearListParams">重置</el-button>
      </div>
    </div>
    <heltable
      ref="tb"
      @sizeChange="sizeChange"
      @pageChange="pageChange"
      :total="listData.paginator.totalCount"
      :currentPage="listParams.page"
      :pageSize="listParams.pageSize"
      :data="listData.list"
      :multiple="true"
      @selection-change="selectChange"
      :loading="isListDataLoading"
    >
      <el-table-column label="业务单号" align="center" width="160">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="setOrderDetailDialogOpen(listData.list[scope.$index])"
          >{{listData.list[scope.$index].settlementNo}}</el-button>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        :prop="item.prop"
        :label="item.label"
        :fixed="needfixed(item.fixed)"
        :key="item.id"
        v-for="(item) in tableHeader"
        :show-overflow-tooltip="showOverflowTooltip"
      >
        <template slot-scope="scope">
          <span
            v-if="item.prop !='status' && item.prop !='appCode' && item.prop !='callbackStatus'"
          >{{listData.list[scope.$index][item.prop]}}</span>
          <span
            v-if="item.prop == 'status'"
          >{{DICT.PAY_STATUS[listData.list[scope.$index].status] || "-"}}</span>
          <span
            v-if="item.prop == 'appCode'"
          >{{DICT.APP_INFO[listData.list[scope.$index].appCode] || "-"}}</span>

          <div v-if="item.prop == 'callbackStatus'">
            <el-tooltip :content="listData.list[scope.$index].callbackResult" placement="bottom">
              <el-button type="text">{{DICT.NOTIFY_STATUS[listData.list[scope.$index].callbackStatus]}}</el-button>
            </el-tooltip>
          </div>

        </template>
      </el-table-column>
    </heltable>
    <orderdetaildialog 
      :title="title3"
      :visible="orderdetailVisible"
      :cancleCb="closeOrderDetailDialog"
      :data="orderdetailData">
    </orderdetaildialog>
  </div>
</template>

<script>
import NP from "number-precision";
import { mapActions, mapState } from "vuex";
import { timerMixin, dictMixin, shrinkMixin,accountMixin } from "@/common/mixin.js";
import { judgeAuth } from "@/util/util.js";
import {DICT_SELECT_ARR} from "@/common/util.js";
import DICT from "@/util/dict.js";
import heltable from "@/components/hl_table";
import showbanner from "./showbanner.vue";
import orderdetaildialog from "./orderdetaildialog.vue";
const ORDER_STATUS = [1, 8]; // 状态只能是1,8
const AUTH_OPTION_STATUS = 8; // 重新转账只能是8
const defaulttableHeader = [
  {
    prop: "creditNo",
    label: "交易凭证号",
    width: "180"
  },
  {
    prop: "fund",
    label: "款项",
    width: "180"
  },
  {
    prop: "amount",
    label: "金额(元)",
    width: "180"
  },
  {
    prop: "appCode",
    label: "数据来源",
    width: "180"
  },
  {
    prop: "payerAccountName",
    label: "转出账户名",
    width: "180"
  },
  {
    prop: "payeeAccountName",
    label: "转入账户名",
    width: "180"
  },
  {
    prop: "payeeBankNo",
    label: "转入账户号",
    width: "180"
  },
  {
    prop: "payeeOpenDept",
    label: "转入账户开户机构",
    width: "180"
  },
  {
    prop: "status",
    label: "状态",
    width: "180"
  },
  {
    prop: "callbackStatus",
    label: "同步状态",
    width: "180"
  },
  {
    prop: "returnMsg",
    label: "备注",
    width: "180"
  },
  {
    prop: "payTime",
    label: "支付时间",
    width: "180"
  }
];

export default {
  name: "tradedetail",
  mixins: [timerMixin, dictMixin, shrinkMixin,accountMixin],
  components: {
    heltable,
    showbanner,
    orderdetaildialog
  },
  data() {
    return {
      /**权限*/
      datasync: false,
      batchexport:false,
      breadTitle: ["财务中心", "财务转账记录"],
      /**表格相关*/
      tableHeader: defaulttableHeader,
      showOverflowTooltip: true,
      /*多选的row*/
      selectedItems: [],
      title: "重新转账",
      title3:'交易详细',
      /***隐藏*/
      showup: false,
      DICT: DICT,
      notifyStatusList: DICT_SELECT_ARR(DICT.NOTIFY_STATUS)
    };
  },
  computed: {
    ...mapState("tradedetail", [
      "isListDataLoading",
      "isBalanceDataLoading",
      "isSyncDataLoading",
      "isDownExcelLoading",
      "listParams",
      "listData",
      "balanceList"
    ]),
    ...mapState("app", [
      "orderdetailVisible",
      "orderdetailData"
    ]),        
    computedIcon() {
      return this.showup ? "el-icon-arrow-up" : "el-icon-arrow-down";
    },
    filterOrderStatus() {
      return this.payOrderStatusList.filter(item => {
        return ORDER_STATUS.includes(Number(item.value));
      });
    },
    /**选中过滤必须是状态8重新转账的*/
    authOptionItems() {
      return this.selectedItems.filter(item => {
        return item.status === AUTH_OPTION_STATUS;
      });
    },
    computedCount() {
      let count = 0;
      for (let i = 0; i < this.authOptionItems.length; i++) {
        let amount = this.authOptionItems[i].amount;
        count = NP.plus(count, amount);
      }
      return count;
    },
    ids() {
      return this.authOptionItems.map(item => {
        return item.id;
      });
    }
  },
  methods: {
    ...mapActions("tradedetail", [
      "getListDataBylistParams",
      "clearListParams",
      "changePage",
      "changePageSize",
      "manualSync",
      "download"
    ]),
    ...mapActions("app", [
      "openOrderDetailDialog",
      "closeOrderDetailDialog"
    ]),    
    sizeChange(size) {
      this.changePageSize(size);
    },
    pageChange(page) {
      this.changePage(page);
    },
    selectChange(selection) {
      this.selectedItems = selection.slice();
    },
    setOrderDetailDialogOpen(item){
      const {settlementNo,id} = item
      this.title3 = `业务单号:${settlementNo}交易详细`;
      this.openOrderDetailDialog({id})
    },    
    open() {
      this.$refs.dialog.open();
    },
    needfixed(fixed) {
      if (!fixed) {
        return false;
      } else {
        return fixed;
      }
    },
    needwidth(width) {
      if (!width) {
        return;
      } else {
        return width;
      }
    },
    init() {
      setTimeout(() => {
        this.perm();
        this.clearListParams();
      }, 100);
      this.perm();
    },
    perm() {
      this.datasync = judgeAuth("finance:tradedetail:datasync");
      this.batchexport = judgeAuth("finance:tradedetail:export");
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style scoped lang="less">
.banner-wrap {
  padding: 0px 20px;
  border-bottom: 1px solid #d9d9d9;
  line-height: 19px;
  .colum {
    margin: 20px 10px 10px 10px;
    text-align: center;
    .cashpay {
      margin-bottom: 10px;
      color: #f5222d;
      font-weight: 800;
      font-size: 14px;
    }
  }
}
.search-box {
  flex-wrap: wrap;
  margin: 0;
  .form-item {
    padding-top: 20px;
    .el-button {
      margin-top: 17px;
    }
  }
}
.tip {
  margin: 10px 0 20px 0;
  .line {
    font-size: 20px;
    color: red;
  }
}

.count {
  text-align: right;
  .line {
    font-size: 20px;
    color: red;
  }
}
</style>
