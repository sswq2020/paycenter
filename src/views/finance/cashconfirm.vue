<template>
  <div class="container single-page">
    <hlBreadcrumb :data="breadTitle">
      <el-button class="hlB_buts" size="small" v-if="false" icon="el-icon-download">批量导出</el-button>
      <el-button
        class="hlB_buts"
        size="small"
        v-loading.fullscreen.lock="isrePayLoading"
        @click="overrideStateProps({rePayVisible:true})"
        :disabled="!(authTransferFailItems.length > 0)"
        icon="el-icon-bank-card"
        v-if="rePayment"
      >重新支付</el-button>
      <el-button
        class="hlB_buts"
        size="small"
        v-loading.fullscreen.lock="isrefreshStatusLoading"
        @click="overrideStateProps({refreshStatusVisible:true})"
        :disabled="!(authRefreshItems.length > 0)"
        icon="el-icon-refresh"
        v-if="freshen"
      >刷新状态</el-button>
      <el-button
        class="hlB_buts"
        size="small"
        v-loading.fullscreen.lock="isbatchAuditLoading"
        @click="overrideStateProps({batchAuditVisible:true})"
        :disabled="!(authOptionItems.length > 0)"
        icon="el-icon-edit"
        v-if="transfer"
      >批量转账</el-button>
      <el-button
        class="hlB_buts"
        size="small"
        v-loading.fullscreen.lock="isbatchDeleteLoading"
        @click="overrideStateProps({batchDeleteVisible:true})"
        :disabled="!(authOptionItems.length > 0)"
        icon="el-icon-delete"
        v-if="recision"
      >批量作废</el-button>
    </hlBreadcrumb>
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
        <label>状态</label>
        <div class="form-control">
          <el-select multiple collapse-tags v-model="listParams.status" placeholder="请选择" size="small">
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
        <label>创建时间</label>
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
      :pageSizes="[10]"
      :data="listData.list"
      :multiple="true"
      @selection-change="selectChange"
      :loading="isListDataLoading"
    >
      <el-table-column label="业务单号" align="center">
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
            v-if="item.prop !='status' && item.prop !='appCode'"
          >{{listData.list[scope.$index][item.prop]}}</span>
          <span
            v-if="item.prop == 'status'"
          >{{DICT.PAY_STATUS[listData.list[scope.$index].status] || "-"}}</span>
          <span
            v-if="item.prop == 'appCode'"
          >{{DICT.APP_INFO[listData.list[scope.$index].appCode] || "-"}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="150px" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="openCarddialogdialog(listData.list[scope.$index].auditInstances)"
          >审核详情</el-button>
          <el-button
            type="text"
            class="activate"
            v-loading.fullscreen.lock="ismanualConfirmLoading"
            v-if="manualAuth&&listData.list[scope.$index].status == manual"
            @click="openManualdialog(listData.list[scope.$index])"
          >人工确认</el-button>
        </template>
      </el-table-column>
    </heltable>
    <financedialog
      :data="authOptionItems"
      :tableHeader="tableHeader"
      :hasremark="true"
      :loading="isbatchDeleteLoading"
      :visible="batchDeleteVisible"
      :confirmCb="(auditOpinion)=>{_recision_(auditOpinion)}"
      :cancelCb="()=>{overrideStateProps({batchDeleteVisible:false})}"
      :title="titles[0]">
      <div slot="tip" class="tip">确定要批量{{titles[0]}}<span class="line">{{authOptionItems.length}}</span>条单据吗?</div>
    </financedialog>
    <financedialog
      :data="authOptionItems"
      :tableHeader="tableHeader"
      :loading="isbatchAuditLoading"
      :visible="batchAuditVisible"
      :confirmCb="pass"
      :cancelCb="()=>{overrideStateProps({batchAuditVisible:false})}"
      :title="titles[1]">
      <div slot="tip" class="tip">共有<span class="line">{{authOptionItems.length}}</span>条单据;总付款金额<span class="line">{{$numFormatter(computedCount(authOptionItems))}}</span>
        元,确定要{{titles[1]}}吗？
      </div>
    </financedialog>
    <financedialog
      :data="authRefreshItems"
      :tableHeader="tableHeader"
      :loading="isrefreshStatusLoading"
      :visible="refreshStatusVisible"
      :confirmCb="refresh"
      :cancelCb="()=>{overrideStateProps({refreshStatusVisible:false})}"
      :title="titles[2]">
      <div slot="tip" class="tip">确定要{{titles[2]}}<span class="line">{{authRefreshItems.length}}</span>条单据吗?</div>
    </financedialog>
    <financedialog
      :data="authTransferFailItems"
      :tableHeader="tableHeader"
      :visible="rePayVisible"
      :loading="isrePayLoading"
      :confirmCb="repayToBank"
      :cancelCb="()=>{overrideStateProps({rePayVisible:false})}"
      :title="titles[3]">
      <div slot="tip" class="tip">共有<span class="line">{{authTransferFailItems.length}}</span>条单据;总付款金额<span class="line">{{$numFormatter(computedCount(authTransferFailItems))}}</span>
        元,确定要{{titles[3]}}吗？
      </div>
    </financedialog>
    <manualdialog ref="manualdialog" @confirm="manualdConfirm" :creditNo="superCreditNo"></manualdialog>
    <carddialog ref="carddialog" :data="auditInstances"></carddialog>
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
import { mapActions, mapState, mapMutations } from "vuex";
import { timerMixin, dictMixin, shrinkMixin,accountMixin } from "@/common/mixin.js";
import { judgeAuth } from "@/util/util.js";
import DICT from "@/util/dict.js";
import heltable from "@/components/hl_table";
import hlBreadcrumb from "@/components/hl-breadcrumb";
import financedialog from "./financedialog.vue";
import manualdialog from "./manualdialog.vue";
import carddialog from "./carddialog.vue";
import showbanner from "./showbanner.vue";
import orderdetaildialog from "./orderdetaildialog.vue";
const ORDER_STATUS = [4, 5, 6, 7, 11, 12, 13, 14]; // 状态只能是4,5,6,7,11,12,13,14
const AUTH_OPTION_STATUS = 4; // 批量作废或者转账的
const AUTH_REFRESH_STATUS = [6, 7]; // 状态刷新的
const MANUAL_STATUS = 7; // 人工确认必须是7
const BANK_REQ_FAIL = 13; // 银行请求失败
const defaulttableHeader = [
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
    prop: "createdTime",
    label: "创建时间",
    width: "180"
  }
];
export default {
  name: "cashconfirm",
  mixins: [timerMixin, dictMixin, shrinkMixin,accountMixin],
  components: {
    heltable,
    hlBreadcrumb,
    financedialog,
    manualdialog,
    carddialog,
    showbanner,
    orderdetaildialog
  },
  data() {
    return {
      breadTitle: ["财务中心", "财务出纳支付"],
      /**权限*/
      recision: false,
      transfer: false,
      manualAuth: false,
      freshen: false,
      rePayment:false,
      /**表格相关*/
      tableHeader: defaulttableHeader,
      showOverflowTooltip: true,
      pageSizes: [10],
      /*多选的row*/
      selectedItems: [],
      titles: ["作废", "确认转账", "刷新", "重新支付"],
      manual: MANUAL_STATUS,
      /**人工确认父组件传递的凭证号*/
      superCreditNo: "",
      /***隐藏*/
      showup: false,
      title3:'交易详细',      
      DICT: DICT
    };
  },
  computed: {
    ...mapState("cashconfirm", [
      "isListDataLoading",
      "isbatchAuditLoading",
      "isbatchDeleteLoading",
      "isrefreshStatusLoading",
      "ismanualConfirmLoading",
      "isrePayLoading",
      "listParams",
      "listData",
      "manualId",
      "auditInstances",
      "batchAuditVisible",
      "batchDeleteVisible",
      "refreshStatusVisible",
      "rePayVisible"
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
    /**选中的只能作废或者转账的*/
    authOptionItems() {
      return this.selectedItems.filter(item => {
        return item.status === AUTH_OPTION_STATUS;
      });
    },
    /**选中的只能状态刷新的*/
    authRefreshItems() {
      return this.selectedItems.filter(item => {
        return AUTH_REFRESH_STATUS.includes(Number(item.status));
      });
    },
    /**选中只能是银行请求失败,可以重新支付**/
    authTransferFailItems() {
      return this.selectedItems.filter(item => {
        return item.status === BANK_REQ_FAIL;
      });
    },
    ids() {
      return this.authOptionItems.map(item => {
        return item.id;
      });
    },
    refreshids() {
      return this.authRefreshItems.map(item => {
        return item.id;
      });
    },
    repayids() {
      return this.authTransferFailItems.map(item => {
        return item.id;
      });
    }
  },
  methods: {
    ...mapMutations("cashconfirm", [
      "setManualId",
      "setAuditInstances",
      "overrideStateProps"
    ]),
    ...mapActions("cashconfirm", [
      "getListDataBylistParams",
      "clearListParams",
      "changePage",
      "changePageSize",
      "batchCash",
      "refreshStatus",
      "rePay",
      "cashierConfirm"
    ]),
    ...mapActions("app", [
      "openOrderDetailDialog",
      "closeOrderDetailDialog"
    ]),       
    ...mapActions("tradedetail", ["getBalanceData"]),
    computedCount(arr = []) {
      let count = 0;
      for (let i = 0; i < arr.length; i++) {
        let amount = arr[i].amount;
        count = NP.plus(count, amount);
      }
      return count;
    },
    sizeChange(size) {
      this.changePageSize(size);
    },
    pageChange(page) {
      this.changePage(page);
    },
    selectChange(selection) {
      this.selectedItems = selection.slice();
    },
    openManualdialog(obj) {
      this.superCreditNo = obj.creditNo || "";
      this.setManualId(obj.id);
      this.$refs.manualdialog.open();
    },
    openCarddialogdialog(auditInstances) {
      this.setAuditInstances(auditInstances);
      this.$refs.carddialog.open();
    },
    setOrderDetailDialogOpen(item){
      const {settlementNo,id} = item
      this.title3 = `业务单号:${settlementNo}交易详细`;
      this.openOrderDetailDialog({id})
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
    _recision_(auditOpinion) {
      const ids = this.ids;
      const auditResult = 0;
      auditOpinion = auditOpinion || "";
      this.batchCash({ auditOpinion, ids, auditResult });
    },
    pass() {
      const ids = this.ids;
      const auditResult = 1;
      this.batchCash({ ids, auditResult });
    },
    refresh() {
      const ids = this.refreshids.join();
      this.refreshStatus({ ids });
    },
    repayToBank() {
      const ids = this.repayids.join();
      this.rePay({ ids });
    },
    manualdConfirm(form) {
      const { status, memo, creditNo } = form;
      const id = this.manualId;
      this.cashierConfirm({ status, memo, id, creditNo });
    },
    init() {
      setTimeout(() => {
        this.perm();
        this.clearListParams();
      }, 20);
      this.perm();
    },
    perm() {
      this.recision = judgeAuth("finance:cashconfirm:recision");
      this.transfer = judgeAuth("finance:cashconfirm:transfer");
      this.manualAuth = judgeAuth("finance:cashconfirm:manual");
      this.freshen = judgeAuth("finance:cashconfirm:freshen");
      this.rePayment = judgeAuth("finance:cashconfirm:repay");
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
</style>
