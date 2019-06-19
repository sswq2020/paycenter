<template>
  <div class="container single-page">
    <hlBreadcrumb :data="breadTitle">
      <el-button class="hlB_buts" size="small" v-if="false" icon="el-icon-upload2">批量导入</el-button>
      <el-button class="hlB_buts" size="small" v-if="false" icon="el-icon-download">批量导出</el-button>
      <el-button
        class="hlB_buts"
        size="small"
        v-loading.fullscreen.lock="isbatchDeleteLoading"
        v-if="recision"
        @click="overrideStateProps({batchDeleteVisible:true})"
        :disabled="!(authOptionItems.length > 0)"
        icon="el-icon-delete"
      >批量作废</el-button>
      <el-button
        class="hlB_buts"
        size="small"
        v-loading.fullscreen.lock="isbatchAuditLoading"
        v-if="transfer"
        @click="overrideStateProps({batchAuditVisible:true})"
        :disabled="!(authOptionItems.length > 0)"
        icon="el-icon-edit"
      >批量审核</el-button>
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
          <el-input v-model="listParams.settlementNo" placeholder="请输入业务单号" size="small"></el-input>
        </div>
      </div>
      <div class="form-item">
        <label>状态</label>
        <div class="form-control">
          <el-select multiple collapse-tags v-model="listParams.status" placeholder="请选择状态" size="small">
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
          <el-select v-model="listParams.appCode" placeholder="请选择数据来源" size="small">
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
            width="100%"
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
            <el-input v-model="listParams.payerAccountName" placeholder="请输入转出账户名" size="small"></el-input>
          </div>
        </div>
      </el-collapse-transition>
      <el-collapse-transition>
        <div class="form-item" v-show="toggle">
          <label>转入账户名</label>
          <div class="form-control">
            <el-input v-model="listParams.payeeAccountName" placeholder="请输入转入账户名" size="small"></el-input>
          </div>
        </div>
      </el-collapse-transition>
      <el-collapse-transition>
        <div class="form-item" v-show="toggle">
          <label>转入账户号</label>
          <div class="form-control">
            <el-input v-model="listParams.payeeBankNo" placeholder="请输入转入账户号" size="small"></el-input>
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
      <div class="form-item" style="margin-right:0px">
        <el-button size="small" type="primary" :loading="isListDataLoading" @click="getListDataBylistParams">查询</el-button>
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
      <el-table-column
        align="center"
        :prop="item.prop"
        :label="item.label"
        :fixed="needfixed(item.fixed)"
        :width="needwidth(item.width)"
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
      <el-table-column label="操作" fixed="right" width="60px" align="center">
        <template slot-scope="scope">
          <el-button
            :disabled="!(listData.list[scope.$index].auditInstances.length > 0)"
            type="text"
            @click="openCarddialogdialog(listData.list[scope.$index].auditInstances)"
          >审核详情</el-button>
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
      :title="title1">
      <div slot="tip" class="tip">确定要批量{{title1}}
        <span class="line">{{authOptionItems.length}}</span>条单据吗?
      </div>
    </financedialog>
    <financedialog
      :data="authOptionItems"
      :tableHeader="tableHeader"
      :loading="isbatchAuditLoading"
      :visible="batchAuditVisible"
      :confirmCb="pass"
      :cancelCb="()=>{overrideStateProps({batchAuditVisible:false})}"  
      :title="title2">
      <div slot="tip" class="tip">确定要批量{{title2}}
        <span class="line">{{authOptionItems.length}}</span>条单据吗?
      </div>
    </financedialog>
    <carddialog ref="carddialog" :data="auditInstances"></carddialog>
  </div>
</template>
<script>
import { mapActions, mapState,mapMutations } from "vuex";
import { timerMixin, dictMixin, shrinkMixin } from "@/common/mixin.js";
import { judgeAuth } from "@/util/util.js";
import DICT from "@/util/dict.js";
import heltable from "@/components/hl_table";
import hlBreadcrumb from "@/components/hl-breadcrumb";
import showbanner from "./showbanner.vue";
import financedialog from "./financedialog.vue";
import carddialog from "./carddialog.vue";
const ORDER_STATUS = [2, 3, 10]; // 状态只能是2,3,10
const AUTH_OPTION_STATUS = 2;
const defaulttableHeader = [
  {
    prop: "settlementNo",
    label: "业务单号"
    // width: "120"
  },
  {
    prop: "fund",
    label: "款项"
    // width: "120"
  },
  {
    prop: "amount",
    label: "金额(元)"
    // width: "120"
  },
  {
    prop: "appCode",
    label: "数据来源"
    // width: "120"
  },
  {
    prop: "payerAccountName",
    label: "转出账户名"
    // width: "120"
  },
  {
    prop: "payeeAccountName",
    label: "转入账户名"
    // width: "120"
  },
  {
    prop: "payeeBankNo",
    label: "转入账户号"
    // width: "120"
  },
  {
    prop: "payeeOpenDept",
    label: "转入账户开户机构",
    width: "120"
  },
  {
    prop: "status",
    label: "状态",
    fixed: "right"
    // width: "120"
  },
  {
    prop: "createdTime",
    label: "创建时间"
    // width: "120"
  }
];
export default {
  name: "review",
  mixins: [timerMixin, dictMixin, shrinkMixin],
  components: {
    heltable,
    hlBreadcrumb,
    showbanner,
    financedialog,
    carddialog
  },
  data() {
    return {
      breadTitle: ["财务中心", "财务经理审核"],
      /**权限*/
      recision: false,
      transfer: false,
      /**表格相关*/
      tableHeader: defaulttableHeader,
      showOverflowTooltip: true,
      /*多选的row*/
      selectedItems: [],
      title1: "作废",
      title2: "审核通过",
      DICT: DICT
    };
  },
  computed: {
    ...mapState("review", [
      "isListDataLoading",
      "isbatchAuditLoading",
      "isbatchDeleteLoading",
      "listParams",
      "listData",
      "auditInstances",
      "batchAuditVisible",
      "batchDeleteVisible"
    ]),
    filterOrderStatus() {
      return this.payOrderStatusList.filter(item => {
        return ORDER_STATUS.includes(Number(item.value));
      });
    },
    ids() {
      return this.authOptionItems.map(item => {
        return item.id;
      });
    },
    authOptionItems() {
      return this.selectedItems.filter(item => {
        return item.status === AUTH_OPTION_STATUS;
      });
    }
  },
  methods: {
    ...mapMutations("review", ["setAuditInstances","overrideStateProps"]),
    ...mapActions("review", [
      "getListDataBylistParams",
      "clearListParams",
      "changePage",
      "changePageSize",
      "batchAudit",
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
    needfixed(fixed) {
      return !fixed ? false : fixed;
    },
    needwidth(width) {
      if (!width) {
        return;
      } else {
        return width;
      }
    },
    openCarddialogdialog(auditInstances) {
      this.setAuditInstances(auditInstances);
      this.$refs.carddialog.open();
    },
    _recision_(auditOpinion) {
      const ids = this.ids;
      const auditResult = 0;
      auditOpinion = auditOpinion || "";
      this.batchAudit({ auditOpinion, ids, auditResult });
    },
    pass() {
      const ids = this.ids;
      const auditResult = 1;
      this.batchAudit({ ids, auditResult });
    },
    init() {
      setTimeout(() => {
        this.perm();
        this.clearListParams();
      }, 50);
      this.perm();
    },
    perm() {
      this.recision = judgeAuth("finance:review:recision");
      this.transfer = judgeAuth("finance:review:transfer");
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
