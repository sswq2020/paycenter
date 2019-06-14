<template>
  <div class="container single-page">
    <hlBreadcrumb :data="breadTitle"></hlBreadcrumb>
    <div class="banner-wrap">
      <showbanner>
        <div class="colum">
          <div class="cashpay">￥{{$numFormatter(bankAccountInfoDetail.balance)}}</div>
          <div class>账户余额</div>
        </div>
      </showbanner>
    </div>
    <div class="search-box">
      <div class="form-item">
        <label>交易时间</label>
        <div class="form-control">
          <el-date-picker
            v-model="listParams.timeRange"
            type="daterange"
            size="small"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          ></el-date-picker>
        </div>
      </div>
      <div class="form-item">
        <el-button type="primary" :loading="isListDataLoading" @click="getListDataBylistParams" size="small">查询</el-button>
        <el-button size="small" @click="clearListParams">重置</el-button>
      </div>
    </div>
    <heltable
      @pageChange="pageChange"
      :data="listData.list"
      :loading="isListDataLoading"
      :pageSize="pageSize"
      :current-page="listParams.startpage"
      :layout="layout"
      :total="listData.paginator.totalPage"
    >
      >
      <el-table-column
        align="center"
        :prop="item.prop"
        :label="item.label"
        :key="item.id"
        v-for="(item) in tableHeader"
        :show-overflow-tooltip="showOverflowTooltip"
      >
        <template slot-scope="scope">
          <span
            v-if="item.prop !='dorc'"
          >{{listData.list[scope.$index][item.prop]}}</span>
          <span v-if="item.prop == 'dorc'">{{listData.list[scope.$index].dorc == "1" ? '收入':'支出'}}</span>
        </template>
      </el-table-column>
    </heltable>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { dayMixin } from "@/common/mixin.js";
import heltable from "@/components/hl_table";
import hlBreadcrumb from "@/components/hl-breadcrumb";
import showbanner from "./showbanner.vue";
const defaulttableHeader = [
  {
    prop: "tranTime",
    label: "交易时间"
  },
  {
    prop: "dorc",
    label: "交易类型"
  },
  {
    prop: "creditNo",
    label: "凭证号"
  },
  {
    prop: "accName1",
    label: "对方账户名称"
  },

  {
    prop: "accNo1",
    label: "对方账号"
  },
  {
    prop: "abstractData",
    label: "摘要"
  },
  {
    prop: "amount",
    label: "发生金额"
  },
  {
    prop: "balance",
    label: "余额"
  }
];
export default {
  name: "accountTradeDetails",
  mixins: [dayMixin],
  components: {
    hlBreadcrumb,
    showbanner,
    heltable
  },
  data() {
    return {
      /**表格相关*/
      tableHeader: defaulttableHeader,
      showOverflowTooltip:true,
      pageSize: 1,
      layout: "prev, pager, next"
    };
  },
  computed: {
    ...mapState("accountTradeDetails", [
      "bankAccountInfoDetail",
      "listParams",
      "listData",
      "isListDataLoading"
    ]),
    breadTitle() {
      return ["财务中心", "账户:"+this.bankAccountInfoDetail.accName + "交易明细"];
    }
  },
  methods: {
    ...mapActions("accountTradeDetails", [
      "getListDataBylistParams",
      "changePage",
      "clearListParams"
    ]),
    pageChange(page) {
      console.log("跳转第几页"+page);
      this.changePage(page);
    },
    init() {
      setTimeout(() => {
        this.clearListParams();
      }, 100);
    },
  },
  mounted() {
    this.init();
  },
  created() {
    if (!this.bankAccountInfoDetail || !this.bankAccountInfoDetail.accountId) {
      this.$router.push("/web/bankAccount/pageList/hlet");
    }
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
    .cash {
      margin-bottom: 10px;
      color: #00c57c;
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
}
</style>
