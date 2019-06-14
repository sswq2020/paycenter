<template>
  <el-dialog
    width="800px"
    :visible.sync="carddialog"
    :center="true"
    title="审核详情"
  >
      <el-table stylestripe border :data="data" style="margin-bottom:50px;">
      <el-table-column
        show-overflow-tooltip
        align="center"
        :prop="item.prop"
        :label="item.label"
        :key="index"
        v-for="(item,index) in tableHeader"
      >
        <template slot-scope="scope">
          <span v-if="item.prop !='auditResult'">{{data[scope.$index][item.prop]}}</span>
          <span v-if="item.prop == 'auditResult'">{{data[scope.$index].auditResult === 1 ? "审核通过" : "已作废"}}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
const defaultAuditResultTableHeader =[
  {
    prop: "auditResult",
    fixed: "right",
    label: "审核结果",
    width: "80"
  },
  {
    prop: "auditorName",
    fixed: "right",
    label: "审核人",
    width: "100"
  },
  {
    prop: "auditTime",
    fixed: "right",
    label: "审核时间",
     width: "120",
  },
  {
    prop: "auditOpinion",
    fixed: "right",
    label: "审核意见",
     width: "200"
  },
];
export default {
  name: "carddialog",
  props: {
    data: {
      type: Array,
      default: () => []
    },
    tableHeader:{
      type: Array,
      default: () => [...defaultAuditResultTableHeader]
    }
  },
  data() {
    return {
      carddialog: false
    };
  },
  methods: {
    open() {
      this.carddialog = true;
    },
    cancle() {
      this.carddialog = false;
    },
    confirm() {
      this.carddialog = false;
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
    color:#000000a5
  }
  .remark {
    flex: 4;
    line-height: 18px;
    color:#000000a5
  }
}
</style>
