<template>
  <div v-if="visible">
    <el-dialog
      width="1200px"
      :visible="visible"
      :center="true"
      @close="cancle"
      :close-on-click-modal="false"
      :title="title"
    >
      <el-table stylestripe border :data="curdata">
        <el-table-column
          show-overflow-tooltip
          align="center"
          :prop="item.prop"
          :width="item.width"
          :label="item.label"
          :key="index"
          v-for="(item,index) in tableHeader"
        >
          <template slot-scope="scope">
            <span>{{curdata[scope.$index][item.prop]}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="cur"
          :page-size="pagesize"
          layout="total, prev, pager, next"
          :total="totalPages"
        ></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const defaultAuditResultTableHeader = [
  {
    prop: "orderCode",
    label: "交易单号",
    width: "150"
  },
  {
    prop: "memberName",
    label: "交易会员",
    width: "120"
  },  
  {
    prop: "transDt",
    label: "交易日期",
    width: "150"
  },  
  {
    prop: "applAmt",
    label: "交易金额",
    width: "120"
  },
  {
    prop: "memo",
    label: "交易详情",
    width: "650"
  }
];
export default {
  name: "orderdetaildialog",
  props: {
    data: {
      type: Array,
      default: () => []
    },
    tableHeader: {
      type: Array,
      default: () => [...defaultAuditResultTableHeader]
    },
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    },
    cancleCb: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      cur: 1,
      pagesize: 5
    };
  },
  computed: {
    totalPages() {
      return this.data.length;
    },
    curdata() {
      return this.data.slice((this.cur - 1) * 5, this.cur * 5);
    }
  },
  methods: {
    cancle() {
      this.cancleCb();
    },
    handleCurrentChange(cur) {
      this.cur = cur;
    }
  },
  watch: {
    visible(newv) {
      if (!newv) {
        this.cur = 1;
      }
    }
  }
};
</script>
<style scoped lang="less">
.list-item {
  display: flex;
  margin: 0px 0px 20px 0px;
  align-items: flex-center;
  flex-wrap: wrap;
  .result {
    flex: 1;
    font-size: 18px;
    font-weight: 500;
  }
  .person {
    flex: 2;
    font-size: 18px;
    font-weight: 500;
  }
  .time {
    flex: 2;
    line-height: 18px;
    color: #000000a5;
  }
  .remark {
    flex: 4;
    line-height: 18px;
    color: #000000a5;
  }
}
</style>
